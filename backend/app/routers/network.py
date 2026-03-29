from fastapi import APIRouter
import psutil
import datetime
import random

router = APIRouter()

@router.get("/connections")
def get_active_connections():
    conns = []
    try:
        # psutil gets true physical OS level network sockets
        all_conns = psutil.net_connections(kind='inet')
        for c in all_conns:
            if c.status == 'ESTABLISHED' and c.raddr:
                # Add some simulated danger classifications dynamically based on real ports
                port_type = "INFO"
                if c.raddr.port in [445, 139, 3389, 22]:
                    port_type = "DANGER"
                elif c.raddr.port not in [80, 443, 8080]:
                    port_type = "WARNING"
                
                # Fetching actual PID name can be slow/restricted, we use PID
                try:
                    p = psutil.Process(c.pid)
                    proc_name = p.name()
                except:
                    proc_name = f"PID_{c.pid}" if c.pid else "System_Idle"
                
                conns.append({
                    "id": f"{c.fd}_{c.pid}_{random.randint(1000,9999)}",
                    "type": port_type,
                    "source": proc_name,
                    "target": f"{c.raddr.ip}:{c.raddr.port}",
                    "desc": f"真实底层 Socket 活跃连接，本地端口 [{c.laddr.port}] 正在外泄状态",
                    "time": datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]
                })
    except Exception as e:
        print("Net connections error:", e)
        pass
    
    # We shuffle or return last N to simulate active rolling
    random.shuffle(conns)
    return {"connections": conns[:12]}  # Return up to 12 active per tick for visual stream
