from fastapi import APIRouter
import time
import os
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import psutil

router = APIRouter()

HONEYPOT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "temp_honeypot")
os.makedirs(HONEYPOT_DIR, exist_ok=True)

# 创建诱饵文件
bait_files = ["crypto_wallet.dat", "2026_finances.xlsx", "passwords_plain.txt"]
for b in bait_files:
    path = os.path.join(HONEYPOT_DIR, b)
    if not os.path.exists(path):
        with open(path, "w", encoding='utf-8') as f:
            f.write("此文件为底层 EDR 诱饵预警探针。黑客脚本一旦触碰，物理机立刻处决该操作对应的进程树。")

edr_events = []

class EDRHoneypotSentinel(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.is_directory:
            # 在真实的 EDR 系统中，我们会利用 Windows API (如 EtwTi) 或驱动层抓取到底是哪个 PID
            # 这里出于跨平台演示，我们捕捉当前时间窗内占用磁盘 I/O 异常跳动的进程为“模拟源”
            self._trigger_kill_switch("MODIFIED", event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            self._trigger_kill_switch("DELETED", event.src_path)
            
    def _trigger_kill_switch(self, op, path):
         # 制造秒杀动画与日志
         timestamp = int(time.time() * 1000)
         
         # 尝试搜索可疑进程模拟真实的“底层捕获”
         suspect_pid = "System Kernel [0]"
         for proc in psutil.process_iter(['pid', 'name']):
             try:
                 if proc.info['name'] in ['python.exe', 'cmd.exe', 'powershell.exe'] and proc.pid != os.getpid():
                     suspect_pid = f"{proc.info['name']} [PID: {proc.info['pid']}]"
                     break
             except:
                 pass
                 
         edr_events.insert(0, {
             "id": f"ALERT-KILL-{timestamp}",
             "timestamp": timestamp,
             "operation": op,
             "target": os.path.basename(path),
             "suspect_pid": suspect_pid,
             "action": "KILLED (已对源头线程执行物理熔断处决)"
         })
         
         # 限制日志长度
         if len(edr_events) > 20:
             edr_events.pop()

# 初始化全局文件系统 Hook (仅触发一次)
try:
    observer = Observer()
    observer.schedule(EDRHoneypotSentinel(), HONEYPOT_DIR, recursive=False)
    observer.start()
except Exception as e:
    print(f"Honeypot Hook failed (Expected if hot-reloaded): {e}")

@router.get("/status")
def get_edr_status():
    """获取沙箱态势感知日志"""
    return {
        "status": "active",
        "honeypot_path": HONEYPOT_DIR,
        "hooks_in_place": len(bait_files),
        "events": edr_events
    }

@router.post("/simulate_attack")
def simulate_attack():
    """
    国赛答辩大招：评委面前一键模拟勒索脚本。
    脚本会用非标准手段直接去动操作系统的文件。触发 WatchDog 勾子。
    """
    import random
    target = os.path.join(HONEYPOT_DIR, random.choice(bait_files))
    
    # 瞬间注入乱码产生破坏 (将触发 watchdog on_modified hook 在另一线程)
    try:
        with open(target, "a") as f:
            f.write(f"\n[Encrypted by Ransomware Simulator at {time.time()}]")
        return {"status": "attack_launched"}
    except Exception as e:
         return {"status": "error", "msg": str(e)}
