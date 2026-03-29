from fastapi import APIRouter
from pydantic import BaseModel
import random
import time

router = APIRouter()

COMPANIES = [
    "OpenAI 语料训练所",
    "Meta AI 研究院",
    "Google Health 数据枢纽",
    "Tesla 自动驾驶视觉组",
    "字节跳动推荐算法组",
    "苹果全球医疗数据中心"
]

DATA_TYPES = [
    "经 DP 加噪的东亚薪资分布数据包",
    "经差分处理的高保真医疗体检指标",
    "去除 EXIF 坐标的千万级生活场景图像集",
    "完全脱敏剥离的浏览器硬件环境矩阵",
    "清洗过的用户行为意图与购买倾向谱图",
    "通过联邦学习处理的高级对话逻辑日志"
]

@router.get("/bids")
def get_live_bids():
    """
    流式模拟生成最新的 5 条顶级 AI 巨头对被脱敏数据的求购订单
    此接口代表着用户隐私被数学化保护后产生的合规商业变现价值
    """
    bids = []
    # 生成 1 到 5 秒时间范围内的假交易订单
    current_ts = int(time.time() * 1000)
    for i in range(5):
        base_price = round(random.uniform(500, 8500), 2)
        bids.append({
            "id": f"BD-{random.randint(100000, 999999)}",
            "buyer": random.choice(COMPANIES),
            "demand": random.choice(DATA_TYPES),
            "price": base_price,
            "timestamp": current_ts - random.randint(1000, 30000), # 过去 30 秒内的报价
            "status": "竞拍生效中"
        })
    return {"status": "success", "bids": bids}

@router.get("/revenue")
def get_user_revenue():
    """
    模拟用户的流转收益账户：只要签署了授权，差分隐私后的废料就开始印钞
    """
    return {
        "status": "success", 
        "total_revenue": round(random.uniform(12400.50, 12600.99), 2),
        "recent_yield": round(random.uniform(12.5, 45.8), 2)
    }
