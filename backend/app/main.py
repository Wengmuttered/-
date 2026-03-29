from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import password, breach, app_analyzer, history, nlp, network, osint
from app.database import engine
from app.models import Base

# DB Schema init
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create DB tables. Make sure Postgres is running and the privacyguard db exists: {e}")

app = FastAPI(
    title="PrivacyGuard API", 
    version="1.0.0", 
    description="Backend Engine for Personal Privacy Data Security Manager"
)

# Configure CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(password.router, prefix="/api/password", tags=["Password Security"])
app.include_router(breach.router, prefix="/api/breach", tags=["Breach Scanner"])
app.include_router(app_analyzer.router, prefix="/api/app", tags=["App Analyzer Sandbox"])
app.include_router(history.router, prefix="/api/history", tags=["Privacy Management & Dashboard"])
app.include_router(nlp.router, prefix="/api/nlp", tags=["AI Privacy Scanner"])
app.include_router(network.router, prefix="/api/network", tags=["Real OS Level Traffic Sniffer"])
app.include_router(osint.router, prefix="/api/osint", tags=["Real OSINT Port Scanner"])

@app.get("/")
def read_root():
    return {
        "status": "ok", 
        "message": "PrivacyGuard Core Engine Running", 
        "protect_mode": "Zero-Retention Active"
    }
