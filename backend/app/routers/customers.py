from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Customer
from ..schemas import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
    CustomerListResponse,
    MessageResponse,
    ErrorResponse
)

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post(
    "/",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        409: {"model": ErrorResponse, "description": "Email already exists"}
    }
)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    """
    Create a new customer.
    
    - **full_name**: Customer's full name (min 1 char, max 255)
    - **email**: Unique email address
    - **phone**: Optional phone number (max 20 chars)
    """
    # Check if email already exists
    existing_customer = db.query(Customer).filter(Customer.email == customer.email).first()
    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Customer with email '{customer.email}' already exists"
        )
    
    # Create new customer
    db_customer = Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone
    )
    
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    
    return db_customer


@router.get(
    "/",
    response_model=CustomerListResponse,
    responses={
        200: {"description": "List of customers retrieved successfully"}
    }
)
def get_customers(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    db: Session = Depends(get_db)
):
    """
    Get all customers with pagination and search.
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Number of records to return (default: 100, max: 1000)
    - **search**: Search by name or email (optional)
    """
    query = db.query(Customer)
    
    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Customer.full_name.ilike(search_term)) | 
            (Customer.email.ilike(search_term))
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    customers = query.offset(skip).limit(limit).all()
    
    return CustomerListResponse(items=customers, total=total)


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Customer not found"}
    }
)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """
    Get a specific customer by ID.
    """
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found"
        )
    
    return customer


@router.put(
    "/{customer_id}",
    response_model=CustomerResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Customer not found"},
        409: {"model": ErrorResponse, "description": "Email already exists"}
    }
)
def update_customer(
    customer_id: int,
    customer_update: CustomerUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing customer.
    
    All fields are optional. Only provided fields will be updated.
    """
    # Find the customer
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found"
        )
    
    # Check if email is being changed and if it already exists
    if customer_update.email is not None:
        existing_customer = db.query(Customer).filter(
            Customer.email == customer_update.email,
            Customer.id != customer_id
        ).first()
        
        if existing_customer:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Customer with email '{customer_update.email}' already exists"
            )
        customer.email = customer_update.email
    
    # Update fields
    if customer_update.full_name is not None:
        customer.full_name = customer_update.full_name
    
    if customer_update.phone is not None:
        customer.phone = customer_update.phone
    
    db.commit()
    db.refresh(customer)
    
    return customer


@router.delete(
    "/{customer_id}",
    response_model=MessageResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Customer not found"},
        409: {"model": ErrorResponse, "description": "Cannot delete customer with existing orders"}
    }
)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """
    Delete a customer by ID.
    
    Note: Customer cannot be deleted if they have existing orders.
    """
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found"
        )
    
    # Check if customer has orders
    if customer.orders:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete customer with existing orders. Archive instead."
        )
    
    db.delete(customer)
    db.commit()
    
    return MessageResponse(
        message=f"Customer '{customer.full_name}' deleted successfully",
        status="success"
    )