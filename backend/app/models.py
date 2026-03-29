from sqlalchemy import Column, Integer, String, DateTime, JSON
from app.database import Base
import datetime

class ScanHistory(Base):
    __tablename__ = "scan_history"
    
    id = Column(Integer, primary_key=True, index=True)
    scan_type = Column(String(50), index=True)   # 'password', 'breach', 'app_analyzer'
    target = Column(String(255))                 # The masked data, e.g. "admin@xxx.com" -> "a***n@xxx.com"
    result = Column(JSON)                        # Analysis outcome
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
