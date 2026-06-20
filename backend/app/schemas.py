from pydantic import BaseModel, Field, ConfigDict, field_validator, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


# ==================== Product Schemas ====================

class ProductBase(BaseModel):
    """Base schema for Product."""
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    sku: str = Field(..., min_length=1, max_length=100, description="Product SKU (unique)")
    price: Decimal = Field(..., gt=0, description="Product price (must be > 0)")
    stock_quantity: int = Field(..., ge=0, description="Available stock quantity (must be >= 0)")

    @field_validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty or whitespace only')
        return v.strip()

    @field_validator('sku')
    def validate_sku(cls, v):
        if not v.strip():
            raise ValueError('SKU cannot be empty or whitespace only')
        return v.upper().strip()


class ProductCreate(ProductBase):
    """Schema for creating a new Product."""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating an existing Product."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)

    @field_validator('name')
    def validate_name(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Name cannot be empty or whitespace only')
        return v.strip() if v else v

    @field_validator('sku')
    def validate_sku(cls, v):
        if v is not None and not v.strip():
            raise ValueError('SKU cannot be empty or whitespace only')
        return v.upper().strip() if v else v


class ProductResponse(ProductBase):
    """Schema for Product response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class ProductListResponse(BaseModel):
    """Schema for list of Products response."""
    items: List[ProductResponse]
    total: int


# ==================== Customer Schemas ====================

class CustomerBase(BaseModel):
    """Base schema for Customer."""
    full_name: str = Field(..., min_length=1, max_length=255, description="Customer's full name")
    email: EmailStr = Field(..., description="Customer's email (unique)")
    phone: Optional[str] = Field(None, max_length=20, description="Customer's phone number")

    @field_validator('full_name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Full name cannot be empty or whitespace only')
        return v.strip()


class CustomerCreate(CustomerBase):
    """Schema for creating a new Customer."""
    pass


class CustomerUpdate(BaseModel):
    """Schema for updating an existing Customer."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)

    @field_validator('full_name')
    def validate_name(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Full name cannot be empty or whitespace only')
        return v.strip() if v else v


class CustomerResponse(CustomerBase):
    """Schema for Customer response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class CustomerListResponse(BaseModel):
    """Schema for list of Customers response."""
    items: List[CustomerResponse]
    total: int


# ==================== Order Schemas ====================

class OrderItemBase(BaseModel):
    """Base schema for Order Item."""
    product_id: int = Field(..., gt=0, description="ID of the product")
    quantity: int = Field(..., gt=0, description="Quantity of the product")


class OrderItemCreate(OrderItemBase):
    """Schema for creating an Order Item."""
    pass


class OrderItemResponse(BaseModel):
    """Schema for Order Item response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    product_id: int
    quantity: int
    price_at_purchase: Decimal


class OrderItemDetailResponse(OrderItemResponse):
    """Schema for Order Item with product details."""
    product: Optional[ProductResponse] = None


class OrderBase(BaseModel):
    """Base schema for Order."""
    customer_id: int = Field(..., gt=0, description="ID of the customer")


class OrderCreate(OrderBase):
    """Schema for creating a new Order."""
    items: List[OrderItemCreate] = Field(..., min_length=1, description="List of items in the order")


class OrderResponse(BaseModel):
    """Schema for Order response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemResponse] = []


class OrderDetailResponse(OrderResponse):
    """Schema for detailed Order response with customer info."""
    customer: Optional[CustomerResponse] = None


class OrderListResponse(BaseModel):
    """Schema for list of Orders response."""
    items: List[OrderResponse]
    total: int


# ==================== Dashboard Schemas ====================

class DashboardStats(BaseModel):
    """Schema for dashboard statistics."""
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: List[ProductResponse] = []


class DashboardResponse(BaseModel):
    """Schema for Dashboard response."""
    stats: DashboardStats
    recent_orders: List[OrderResponse] = []
    low_stock_count: int


# ==================== Response Schemas ====================

class MessageResponse(BaseModel):
    """Schema for generic message response."""
    message: str
    status: str = "success"


class ErrorResponse(BaseModel):
    """Schema for error response."""
    detail: str
    status_code: int


# ==================== Pagination Schemas ====================

class PaginationParams(BaseModel):
    """Schema for pagination parameters."""
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(100, ge=1, le=1000, description="Number of records to return")