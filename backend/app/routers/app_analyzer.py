from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
import xmltodict

router = APIRouter()

# 定义危险权限和对应的权重 (分数越高越危险)。
# 这些评分将通过接口发送给前端的雷达图渲染。
DANGEROUS_PERMISSIONS = {
    "android.permission.READ_CONTACTS": {"score": 15, "desc": "读取通讯录", "category": "隐私极高风险"},
    "android.permission.ACCESS_FINE_LOCATION": {"score": 20, "desc": "获取精确GPS位置", "category": "隐私极高风险"},
    "android.permission.ACCESS_COARSE_LOCATION": {"score": 10, "desc": "获取大概位置", "category": "隐私中等风险"},
    "android.permission.RECORD_AUDIO": {"score": 25, "desc": "录制音频/麦克风", "category": "隐私极高风险"},
    "android.permission.CAMERA": {"score": 20, "desc": "调用摄像头", "category": "隐私极高风险"},
    "android.permission.READ_SMS": {"score": 20, "desc": "读取短信", "category": "隐私极高风险"},
    "android.permission.SEND_SMS": {"score": 15, "desc": "发送短信", "category": "财产扣费风险"},
    "android.permission.READ_EXTERNAL_STORAGE": {"score": 5, "desc": "读取外部存储", "category": "一般风险"},
    "android.permission.WRITE_EXTERNAL_STORAGE": {"score": 5, "desc": "写入外部存储", "category": "一般风险"},
    "android.permission.READ_CALL_LOG": {"score": 15, "desc": "读取通话记录", "category": "隐私极高风险"},
}

class AppAnalyzeResponse(BaseModel):
    app_package: str
    total_score: int
    risk_level: str
    permissions_found: list[dict]

@router.post("/analyze", response_model=AppAnalyzeResponse)
async def analyze_manifest(file: UploadFile = File(...)):
    """
    安卓 APP 权限沙箱分析：上传 AndroidManifest.xml
    如果上传的文件不是标准 XML 或者是假冒伪劣 APK，则返回相应的报错。
    """
    if not file.filename.endswith('.xml'):
        raise HTTPException(status_code=400, detail="必须上传 AndroidManifest.xml 文件")
    
    content = await file.read()
    try:
        manifest_dict = xmltodict.parse(content)
        manifest = manifest_dict.get('manifest', {})
        package_name = manifest.get('@package', 'Unknown/Anonymous Package')
        
        uses_permissions = manifest.get('uses-permission', [])
        # 处理单数个权限和复数个权限解析差异的问题
        if isinstance(uses_permissions, dict):
            uses_permissions = [uses_permissions]
            
        found_perms = []
        total_risk_score = 0
        
        for p in uses_permissions:
            perm_name = p.get('@android:name', '')
            if not perm_name:
                continue
                
            risk_info = DANGEROUS_PERMISSIONS.get(perm_name)
            if risk_info:
                found_perms.append({
                    "name": perm_name,
                    "desc": risk_info["desc"],
                    "score": risk_info["score"],
                    "category": risk_info["category"]
                })
                total_risk_score += risk_info["score"]
            else:
                # 记录普通系统权限，作为统计基数
                found_perms.append({
                    "name": perm_name,
                    "desc": "普通系统支持权限",
                    "score": 0,
                    "category": "系统交互"
                })
                
        # 计算风险评级
        risk_level = "被黑客控制 (极高风险)" if total_risk_score >= 50 else \
                     "存在越权 (高风险)" if total_risk_score >= 30 else \
                     "正常商业级 (中等风险)" if total_risk_score >= 10 else "白盒认证 (低风险/安全)"
                     
        return {
            "app_package": package_name,
            "total_score": total_risk_score,
            "risk_level": risk_level,
            "permissions_found": found_perms
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"文件解析沙箱运行失败，该文件可能损坏或被加固: {str(e)}")
