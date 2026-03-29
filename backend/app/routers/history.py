from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ScanHistory

router = APIRouter()

@router.get("/")
def get_user_history(db: Session = Depends(get_db)):
    """获取所有结构化扫描历史，用于前端看板渲染"""
    records = db.query(ScanHistory).order_by(ScanHistory.created_at.desc()).limit(50).all()
    
    return [{
        "id": r.id,
        "scan_type": r.scan_type,
        "target": r.target,
        "result": r.result,
        "created_at": r.created_at
    } for r in records]

@router.post("/log")
def log_history(payload: dict, db: Session = Depends(get_db)):
    """接收单次扫描记录的上传，保存至数据库以便分析追溯"""
    scan_type = payload.get("scan_type", "unknown")
    target = payload.get("target", "***")
    result = payload.get("result", {})
    
    new_record = ScanHistory(scan_type=scan_type, target=target, result=result)
    db.add(new_record)
    db.commit()
    return {"status": "success", "id": new_record.id}

@router.delete("/wipe")
def wipe_all_data(db: Session = Depends(get_db)):
    """隐私管家核心功能：一键彻底物理销毁本地/云端用户记录"""
    db.query(ScanHistory).delete()
    db.commit()
    return {"status": "success", "message": "所有用户扫描数据均已物理擦除 (Zero-Retention Enforced)."}
