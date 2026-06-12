from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import products, customers, orders

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management API")

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL e.g., ["http://localhost:5173", "https://yourfrontend.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Inventory & Order Management API. Go to /docs for the API documentation."}
