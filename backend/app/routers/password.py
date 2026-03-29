from fastapi import APIRouter
import zxcvbn
import hashlib
import httpx
from pydantic import BaseModel

router = APIRouter()

class PasswordCheckRequest(BaseModel):
    password_plain: str

class PasswordCheckResponse(BaseModel):
    score: int
    entropy: float
    feedback: dict
    is_leaked: bool
    leak_count: int

@router.post("/check", response_model=PasswordCheckResponse)
async def check_password(req: PasswordCheckRequest):
    # 1. zxcvbn 强度与信息熵检测
    result = zxcvbn.zxcvbn(req.password_plain)
    
    # 2. 核心特征：K-匿名 数据泄露检测 (Have I Been Pwned API)
    # 不向网络发送明文密码，只发送 SHA-1 哈希值的前 5 位！
    sha1_hash = hashlib.sha1(req.password_plain.encode('utf-8')).hexdigest().upper()
    prefix = sha1_hash[:5]
    suffix = sha1_hash[5:]
    
    is_leaked = False
    leak_count = 0
    
    try:
        async with httpx.AsyncClient() as client:
            # 外部请求只会暴露这 5 位前缀，安全性极高
            response = await client.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5.0)
            if response.status_code == 200:
                # 在后端内存中完成后缀匹配
                hashes = (line.split(":") for line in response.text.splitlines())
                for h, count in hashes:
                    if h == suffix:
                        is_leaked = True
                        leak_count = int(count)
                        break
    except Exception as e:
        print(f"安全情报接口异常 (HIBP Error): {e}")

    return {
        "score": result['score'],
        "entropy": result['guesses_log10'], # 对数形式的信息熵估算
        "feedback": {
            "warning": result['feedback']['warning'],
            "suggestions": result['feedback']['suggestions']
        },
        "is_leaked": is_leaked,
        "leak_count": leak_count
    }
