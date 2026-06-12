from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from . import models, schemas

# --- Products ---
def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_product_by_sku(db: Session, sku: str):
    return db.query(models.Product).filter(models.Product.sku == sku).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = get_product(db, product_id)
    if db_product:
        for key, value in product.model_dump().items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

# --- Customers ---
def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customer_by_email(db: Session, email: str):
    return db.query(models.Customer).filter(models.Customer.email == email).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int):
    db_customer = get_customer(db, customer_id)
    if db_customer:
        db.delete(db_customer)
        db.commit()
    return db_customer

# --- Orders ---
def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def create_order(db: Session, order: schemas.OrderCreate):
    # 1. Verify customer exists
    customer = get_customer(db, order.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total_amount = 0.0
    order_items_data = []

    # 2. Check inventory and calculate total
    for item in order.items:
        product = get_product(db, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {item.product_id} not found")
        
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient inventory for product '{product.name}'. Requested: {item.quantity}, Available: {product.quantity}"
            )
        
        # Calculate cost and prepare item
        item_cost = product.price * item.quantity
        total_amount += item_cost
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": product.price
        })

    # 3. Create the order
    db_order = models.Order(customer_id=order.customer_id, total_amount=total_amount)
    db.add(db_order)
    db.flush() # Flush to get the order ID before creating items

    # 4. Create order items and reduce stock
    for item_data in order_items_data:
        # Create order item
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item_data["product"].id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"]
        )
        db.add(db_order_item)
        
        # Reduce stock
        item_data["product"].quantity -= item_data["quantity"]

    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = get_order(db, order_id)
    if db_order:
        db.delete(db_order)
        db.commit()
    return db_order
