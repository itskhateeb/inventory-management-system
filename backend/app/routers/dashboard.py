from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Product, Customer, Order, OrderItem
from ..schemas import (
    DashboardResponse,
    DashboardStats,
    ProductResponse,
    OrderResponse
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/stats",
    response_model=DashboardResponse,
    responses={
        200: {"description": "Dashboard statistics retrieved successfully"}
    }
)
def get_dashboard_stats(
    low_stock_threshold: int = Query(10, ge=0, description="Threshold for low stock alert"),
    recent_orders_limit: int = Query(5, ge=1, le=50, description="Number of recent orders to return"),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics including:
    - Total products, customers, orders
    - Low stock products
    - Recent orders
    """
    # Get total counts
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    
    # Get low stock products
    low_stock_products = db.query(Product).filter(
        Product.stock_quantity < low_stock_threshold
    ).all()
    
    # Get recent orders with their items
    recent_orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).limit(recent_orders_limit).all()
    
    # Load order items for each order
    for order in recent_orders:
        order.items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()
    
    # Create response
    stats = DashboardStats(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        low_stock_products=low_stock_products
    )
    
    return DashboardResponse(
        stats=stats,
        recent_orders=recent_orders,
        low_stock_count=len(low_stock_products)
    )


@router.get(
    "/low-stock",
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
    """
    products = db.query(Product).filter(
        Product.stock_quantity < threshold
    ).all()
    return products


@router.get(
    "/recent-orders",
    response_model=List[OrderResponse],
    responses={
        200: {"description": "Recent orders retrieved successfully"}
    }
)
def get_recent_orders(
    limit: int = Query(5, ge=1, le=50, description="Number of recent orders to return"),
    db: Session = Depends(get_db)
):
    """
    Get the most recent orders.
    """
    orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).limit(limit).all()
    
    # Load order items for each order
    for order in orders:
        order.items = db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).all()
    
    return orders