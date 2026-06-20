from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal

from ..database import get_db
from ..models import Order, OrderItem, Product, Customer
from ..schemas import (
    OrderCreate,
    OrderResponse,
    OrderDetailResponse,
    OrderListResponse,
    MessageResponse,
    ErrorResponse
)

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post(
    "/",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        404: {"model": ErrorResponse, "description": "Customer or product not found"},
        409: {"model": ErrorResponse, "description": "Insufficient stock"}
    }
)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new order with multiple items.
    
    - **customer_id**: ID of the customer placing the order
    - **items**: List of items with product_id and quantity
    
    The total amount is calculated automatically.
    Stock quantities are reduced automatically.
    """
    # Check if customer exists
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {order.customer_id} not found"
        )
    
    # Validate all products and check stock
    order_items_data = []
    total_amount = Decimal('0.00')
    
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )
        
        # Check stock availability
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Insufficient stock for product '{product.name}'. "
                       f"Available: {product.stock_quantity}, Requested: {item.quantity}"
            )
        
        # Calculate item total
        item_total = product.price * item.quantity
        total_amount += item_total
        
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "price_at_purchase": product.price
        })
    
    # Create order
    db_order = Order(
        customer_id=order.customer_id,
        total_amount=total_amount
    )
    
    db.add(db_order)
    db.flush()  # Get the order ID without committing
    
    # Create order items and update stock
    for item_data in order_items_data:
        product = item_data["product"]
        
        # Create order item
        db_order_item = OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=item_data["quantity"],
            price_at_purchase=item_data["price_at_purchase"]
        )
        db.add(db_order_item)
        
        # Reduce stock
        product.stock_quantity -= item_data["quantity"]
    
    db.commit()
    db.refresh(db_order)
    
    # Load order items for response
    db_order.items = db.query(OrderItem).filter(OrderItem.order_id == db_order.id).all()
    
    return db_order


@router.get(
    "/",
    response_model=OrderListResponse,
    responses={
        200: {"description": "List of orders retrieved successfully"}
    }
)
def get_orders(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    customer_id: Optional[int] = Query(None, description="Filter by customer ID"),
    db: Session = Depends(get_db)
):
    """
    Get all orders with pagination and filtering.
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Number of records to return (default: 100, max: 1000)
    - **customer_id**: Filter orders by customer ID (optional)
    """
    query = db.query(Order)
    
    # Apply customer filter
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    
    # Get total count
    total = query.count()
    
    # Apply pagination with ordering by newest first
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    # Load order items for each order
    for order in orders:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    
    return OrderListResponse(items=orders, total=total)


@router.get(
    "/{order_id}",
    response_model=OrderDetailResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Order not found"}
    }
)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """
    Get a specific order by ID with full details including customer and items.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    # Load order items
    order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    
    # Load customer
    order.customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    
    return order


@router.delete(
    "/{order_id}",
    response_model=MessageResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Order not found"}
    }
)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    Delete an order by ID.
    
    Note: This will also delete all associated order items.
    Stock quantities are NOT restored when deleting an order.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )
    
    db.delete(order)
    db.commit()
    
    return MessageResponse(
        message=f"Order #{order_id} deleted successfully",
        status="success"
    )


@router.get(
    "/customer/{customer_id}/",
    response_model=OrderListResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Customer not found"}
    }
)
def get_customer_orders(
    customer_id: int,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    db: Session = Depends(get_db)
):
    """
    Get all orders for a specific customer.
    
    - **customer_id**: ID of the customer
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Number of records to return (default: 100, max: 1000)
    """
    # Check if customer exists
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found"
        )
    
    query = db.query(Order).filter(Order.customer_id == customer_id)
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    # Load order items for each order
    for order in orders:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    
    return OrderListResponse(items=orders, total=total)