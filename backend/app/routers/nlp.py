from fastapi import APIRouter
from pydantic import BaseModel
import re
import jieba
import jieba.analyse

router = APIRouter()

class PrivacyScanRequest(BaseModel):
    text: str

class PrivacyScanResponse(BaseModel):
    risk_level: str
    score: int
    findings: list[dict]
    keywords: list[dict]

@router.post("/privacy-scan", response_model=PrivacyScanResponse)
def scan_privacy_policy(req: PrivacyScanRequest):
    """
    NLP / 大语言模型 引擎接口: 拆解上万字的霸王条款。
    用于答辩现场的震撼演示（通过正则池对齐特定高危敏感句式来 Mock LLM 的摘要聚合）。
    """
    text = req.text
    
    # 模拟构建高危黑名单的上下文预训练规则库 (NLP Rule Engine)
    risky_patterns = [
        {"regex": r"((关联公司|第三方|商业伙伴|关联方).*?共享.*?信息)", "category": "越权共享交易", "desc": "您的隐私极有可能被平台公开倒卖、或被各种联盟广告商用来精确推送杀熟", "severity": 30},
        {"regex": r"((不同意|拒绝).*?(无法|停止|不能)使用)", "category": "强制下跪式索权", "desc": "违背《个人信息保护法》最小必要原则，用“不给权限就不让用”的强盗逻辑逼迫您妥协", "severity": 25},
        {"regex": r"(免除.*?(责任|赔偿))", "category": "霸王免责", "desc": "利用长串法务术语设下陷阱：当他们的内部员工盗取或泄露您的数据时，您连起诉都赢不了", "severity": 20},
        {"regex": r"(注销账号(需要|应当).*?(审核|通过|条件|工作日))", "category": "注销高墙壁垒", "desc": "刻意制造困难阻止用户数据被遗忘（这是典型的不合规设计），剥夺控制权", "severity": 35},
        {"regex": r"((默认|授权)开通.*?(服务|协议))", "category": "强买强卖陷阱", "desc": "偷偷摸摸帮你勾选一些隐藏的商业吸血服务", "severity": 15},
    ]
    
    findings = []
    total_severity = 0
    
    # 执行文本的分词扫描投影
    for pattern in risky_patterns:
        matches = re.finditer(pattern["regex"], text, re.IGNORECASE)
        for match in matches:
            matched_sentence = match.group(0)
            # 提取前后语境以便在前端可视化展示
            start_idx = max(0, match.start() - 25)
            end_idx = min(len(text), match.end() + 25)
            context = text[start_idx:end_idx].replace("\n", " ")
            
            findings.append({
                "context": f"...{context}...",
                "exact_match": matched_sentence,
                "category": pattern["category"],
                "desc": pattern["desc"],
                "severity": pattern["severity"]
            })
            total_severity += pattern["severity"]
            
    # 利用字典键去重
    unique_findings = {f['exact_match']: f for f in findings}.values()
    
    # [核心技术点] 本地端侧 NLP 分词与 TF-IDF 权重抽离（模拟断网级 AI）
    jieba.setLogLevel(20) # 屏蔽不必要的日志
    extracted_tags = jieba.analyse.extract_tags(text, topK=8, withWeight=True, allowPOS=('n', 'v', 'vn'))
    nlp_keywords = [{"word": tag[0], "weight": round(tag[1], 4)} for tag in extracted_tags]
    
    risk_level = "纯净 (安全)"
    if total_severity > 60:
        risk_level = "极度危险 (到处都是毒瘤条款)"
    elif total_severity > 30:
        risk_level = "高风险合规隐患 (霸王设定多)"
    elif total_severity > 0:
        risk_level = "部分越权风险 (需留意底线)"
        
    return {
        "risk_level": risk_level,
        "score": total_severity,
        "findings": list(unique_findings),
        "keywords": nlp_keywords
    }
