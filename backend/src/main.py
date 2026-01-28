from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import router
from app.core.database import engine, Base

# 1. Create the App
app = FastAPI(title="SYBIL API")

# 2. Define Allowed Origins (Explicitly list your frontend URLs)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# 3. Add Middleware (MUST happen before loading routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # explicit list is safer than ["*"]
    allow_credentials=True,
    allow_methods=["*"],       # Allow all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],       # Allow all headers
)

# 4. Database Startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

# 5. Include Router (This connects your /v1/submit endpoint)
app.include_router(router, prefix="/api")

# 6. specific debug route to verify the API is alive
@app.get("/")
async def root():
    return {"message": "S.Y.B.I.L. Backend is Online"}