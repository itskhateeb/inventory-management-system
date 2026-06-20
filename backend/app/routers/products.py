from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal

from ..database import get_db
from ..models import Product
from ..schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    MessageResponse,
    ErrorResponse
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        409: {"model": ErrorResponse, "description": "SKU already exists"}
    }
)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product.
    
    - name: Product name (min 1 char, max 255)
    - sku: Unique product SKU (min 1 char, max 100)
    - price: Product price (must be > 0)
    - stock_quantity: Available stock (must be >= 0)
    """
    # Check if SKU already exists
    existing_product = db.query(Product).filter(Product.sku == product.sku.upper()).first()
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Product with SKU '{product.sku}' already exists"
        )
    
    # Create new product
    db_product = Product(
        name=product.name,
        sku=product.sku.upper(),
        price=product.price,
        stock_quantity=product.stock_quantity
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.get(
    "/",
    response_model=ProductListResponse,
    responses={
        200: {"description": "List of products retrieved successfully"}
    }
)
def get_products(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    search: Optional[str] = Query(None, description="Search by name or SKU"),
    min_price: Optional[Decimal] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[Decimal] = Query(None, ge=0, description="Maximum price filter"),
    db: Session = Depends(get_db)
):
    """
    Get all products with pagination and filters.
    
    - skip: Number of records to skip (default: 0)
    - limit: Number of records to return (default: 100, max: 1000)
    - search: Search by name or SKU (optional)
    - min_price: Filter by minimum price (optional)
    - max_price: Filter by maximum price (optional)
    """
    query = db.query(Product)
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | 
            (Product.sku.ilike(search_term))
        )
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    products = query.offset(skip).limit(limit).all()
    
    return ProductListResponse(items=products, total=total)


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Product not found"}
    }
)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get a specific product by ID.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Product not found"},
        409: {"model": ErrorResponse, "description": "SKU already exists"}
    }
)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing product.
    
    All fields are optional. Only provided fields will be updated.
    """
    # Find the product
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    # Check if SKU is being changed and if it already exists
    if product_update.sku is not None:
        new_sku = product_update.sku.upper()
        existing_product = db.query(Product).filter(
            Product.sku == new_sku,
            Product.id != product_id
        ).first()
        
        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product with SKU '{product_update.sku}' already exists"
            )
        product.sku = new_sku
    
    # Update fields
    if product_update.name is not None:
        product.name = product_update.name
    
    if product_update.price is not None:
        product.price = product_update.price
    
    if product_update.stock_quantity is not None:
        product.stock_quantity = product_update.stock_quantity
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete(
    "/{product_id}",
    response_model=MessageResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Product not found"},
        409: {"model": ErrorResponse, "description": "Cannot delete product with existing orders"}
    }
)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product by ID.
    
    Note: Product cannot be deleted if it has existing order items.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    # Check if product has order items
    if product.order_items:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete product with existing order items. Archive instead."
        )
    
    db.delete(product)
    db.commit()
    
    return MessageResponse(
        message=f"Product '{product.name}' deleted successfully",
        status="success"
    )


@router.get(
    "/low-stock/",
    response_model=List[ProductResponse],
    responses={
        200: {"description": "Low stock products retrieved successfully"}
    }
)
def get_low_stock_products(
    threshold: int = Query(10, ge=0, description="Stock threshold for low stock alert"),
    db: Session = Depends(get_db)
):
    """
    Get all products with stock quantity below the threshold.
    
    - threshold: Stock threshold (default: 10)
    """
    products = db.query(Product).filter(Product.stock_quantity < threshold).all()
    return products