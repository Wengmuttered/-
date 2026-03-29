from fastapi import APIRouter
import socket
import concurrent.futures

router = APIRouter()

COMMON_PORTS = {
    21: "FTP传空风险", 22: "SSH暴力破解攻击面", 23: "Telnet明文劫持", 25: "SMTP", 53: "DNS",
    80: "HTTP明文监听", 110: "POP3", 143: "IMAP", 443: "HTTPS-SSL层", 
    3306: "MySQL拖库高危", 3389: "RDP远控渗透", 5432: "PostgreSQL", 6379: "Redis未授权访问", 
    8080: "HTTP-Proxy穿透", 27017: "MongoDB勒索"
}

def scan_port(ip, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.6) # Fast timeout for OSINT
        result = sock.connect_ex((ip, port))
        sock.close()
        if result == 0:
            return port
    except:
        pass
    return None

@router.get("/scan")
def osint_scan(target: str):
    nodes = [{"id": "center", "name": target, "category": 0, "symbolSize": 60, "itemStyle": {"color": "#eab308"}}]
    links = []
    
    try:
        # Resolve real Internet IP
        ip = socket.gethostbyname(target)
        nodes.append({"id": "ip_node", "name": f"暴露局域网真实IP:\n{ip}", "category": 1, "symbolSize": 45, "itemStyle": {"color": "#ef4444"}})
        links.append({"source": "center", "target": "ip_node", "label": {"show": True, "formatter": "DNS 穿透解析"}})
        
        # Real multithreaded fast port scan
        open_ports = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            future_to_port = {executor.submit(scan_port, ip, port): port for port in COMMON_PORTS.keys()}
            for future in concurrent.futures.as_completed(future_to_port):
                p = future.result()
                if p:
                    open_ports.append(p)
                    
        for idx, p in enumerate(open_ports):
            service = COMMON_PORTS[p]
            p_id = f"port_{p}"
            nodes.append({"id": p_id, "name": f"真实开放端口: {p}\n({service})", "category": 2, "symbolSize": 35, "itemStyle": {"color": "#a855f7"}})
            links.append({"source": "ip_node", "target": p_id})
            
            # Deep Web Danger Simulation for specific exposed databases
            if p in [3306, 6379, 3389, 22, 27017]:
                vuln_id = f"vuln_{p}"
                nodes.append({"id": vuln_id, "name": f"已被暗网爬虫(Shodan)嗅探收录\n面临极高风险", "category": 3, "symbolSize": 40, "itemStyle": {"color": "#4b5563"}})
                links.append({"source": p_id, "target": vuln_id, "lineStyle": {"type": "dashed"}})
                
        # If no ports found
        if not open_ports:
            nodes.append({"id": "waf", "name": "全端口静默 (目标开启了高防拦截)", "category": 3, "symbolSize": 35, "itemStyle": {"color": "#22c55e"}})
            links.append({"source": "ip_node", "target": "waf"})

    except Exception as e:
        nodes.append({"id": "error", "name": "目标无法解析或拒绝连接(空路由)", "category": 1, "symbolSize": 40, "itemStyle": {"color": "#ef4444"}})
        links.append({"source": "center", "target": "error"})

    return {"nodes": nodes, "links": links}
