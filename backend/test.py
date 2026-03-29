import sys
import traceback
try:
    from app.main import app
    print("BACKEND SUCCESS")
except Exception as e:
    print("BACKEND ERROR:")
    traceback.print_exc()
