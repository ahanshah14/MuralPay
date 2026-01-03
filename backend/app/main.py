from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import products, admin, purchase

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MuralPay API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router)
app.include_router(admin.router)
app.include_router(purchase.router)

@app.get("/")
def root():
    return {"message": "MuralPay API"}

@app.get("/health")
def health():
    return {"status": "healthy"}
