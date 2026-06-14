# 第二章：网络运维与故障排查

## 2.1 TCP/IP 基础

### 三次握手

```
客户端                              服务器
  │                                  │
  │── SYN (seq=x) ─────────────────→│  ① 客户端发送 SYN
  │                                  │
  │←── SYN+ACK (seq=y, ack=x+1) ───│  ② 服务器回复 SYN+ACK
  │                                  │
  │── ACK (ack=y+1) ───────────────→│  ③ 客户端发送 ACK
  │                                  │
  │         连接建立，开始传输数据      │
```

### 四次挥手

```
客户端                              服务器
  │                                  │
  │── FIN (seq=u) ─────────────────→│  ① 客户端发送 FIN
  │                                  │
  │←── ACK (ack=u+1) ──────────────│  ② 服务器确认
  │                                  │
  │←── FIN (seq=w) ────────────────│  ③ 服务器发送 FIN
  │                                  │
  │── ACK (ack=w+1) ───────────────→│  ④ 客户端确认
  │                                  │
  │      TIME_WAIT (2MSL)            │
  │         连接关闭                  │
```

---

## 2.2 DNS 解析与排查

### DNS 解析流程

```
用户输入 www.example.com
        ↓
① 检查本地缓存（hosts 文件、浏览器缓存）
        ↓ 未命中
② 查询本地 DNS 服务器缓存
        ↓ 未命中
③ 本地 DNS → 根 DNS → .com DNS → example.com DNS
        ↓
④ 返回 IP 地址给用户
```

### DNS 排查

```bash
# 查看本地 DNS 配置
cat /etc/resolv.conf

# 查看 hosts 文件
cat /etc/hosts

# 测试 DNS 解析
dig www.example.com
nslookup www.example.com

# 指定 DNS 服务器查询
dig @8.8.8.8 www.example.com

# 追踪 DNS 解析过程
dig +trace www.example.com

# 查看 DNS 缓存（systemd-resolved）
resolvectl statistics
```

### 常见 DNS 问题

```bash
# 问题：DNS 解析失败
# 现象：ping: unknown host www.example.com

# 排查步骤：
# 1. 检查网络连通性
ping 8.8.8.8

# 2. 测试 DNS 服务器
dig @8.8.8.8 www.example.com

# 3. 检查 DNS 配置
cat /etc/resolv.conf

# 4. 临时修改 DNS
echo "nameserver 8.8.8.8" > /etc/resolv.conf
```

---

## 2.3 HTTP/HTTPS 状态码

| 状态码 | 含义 | 排查方向 |
|--------|------|----------|
| **2xx 成功** | | |
| 200 OK | 请求成功 | 正常 |
| 201 Created | 创建成功 | 正常 |
| **3xx 重定向** | | |
| 301 Moved Permanently | 永久重定向 | 检查 URL 是否变更 |
| 302 Found | 临时重定向 | 正常重定向 |
| 304 Not Modified | 缓存有效 | 正常（缓存命中） |
| **4xx 客户端错误** | | |
| 400 Bad Request | 请求格式错误 | 检查请求参数/格式 |
| 401 Unauthorized | 未认证 | 检查认证信息 |
| 403 Forbidden | 无权限 | 检查权限配置 |
| 404 Not Found | 资源不存在 | 检查 URL/路由 |
| 413 Request Entity Too Large | 请求体过大 | 检查 Nginx client_max_body_size |
| **5xx 服务端错误** | | |
| 500 Internal Server Error | 服务器内部错误 | 查看应用日志 |
| 502 Bad Gateway | 网关错误 | 检查后端服务是否运行 |
| 503 Service Unavailable | 服务不可用 | 服务过载或维护中 |
| 504 Gateway Timeout | 网关超时 | 检查后端响应时间 |

---

## 2.4 端口与防火墙

### 端口查看

```bash
# 查看监听端口
ss -tlnp
# 输出示例：
# State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
# LISTEN  0       128     0.0.0.0:22          0.0.0.0:*          users:(("sshd",pid=1234))
# LISTEN  0       128     0.0.0.0:80          0.0.0.0:*          users:(("nginx",pid=5678))

# 查看特定端口
ss -tlnp | grep :80

# 查看所有连接
ss -anp
```

### iptables

```bash
# 查看规则
iptables -L -n

# 允许特定端口
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许特定 IP
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT

# 拒绝特定 IP
iptables -A INPUT -s 10.0.0.100 -j DROP

# 删除规则
iptables -D INPUT 1

# 保存规则
iptables-save > /etc/iptables/rules.v4
```

### firewalld（CentOS/RHEL）

```bash
# 查看状态
firewall-cmd --state

# 查看规则
firewall-cmd --list-all

# 开放端口
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp

# 开放服务
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# 重新加载
firewall-cmd --reload
```

### ufw（Ubuntu）

```bash
# 查看状态
ufw status

# 允许 SSH
ufw allow ssh

# 允许特定端口
ufw allow 80/tcp
ufw allow 443/tcp

# 拒绝所有入站
ufw default deny incoming

# 启用防火墙
ufw enable
```

---

## 2.5 常见网络故障排查

### 无法访问外网

```bash
# 排查步骤：
# 1. 检查网络接口
ip addr show

# 2. 检查网关
ip route show
ping -c 4 网关IP

# 3. 检查 DNS
ping -c 4 8.8.8.8
dig google.com

# 4. 检查防火墙
iptables -L -n

# 5. 路由追踪
traceroute google.com
```

### 服务不通

```bash
# 排查步骤：
# 1. 检查服务是否运行
systemctl status nginx

# 2. 检查端口是否监听
ss -tlnp | grep :80

# 3. 检查防火墙
iptables -L -n | grep 80
firewall-cmd --list-ports

# 4. 本地测试
curl http://localhost

# 5. 远程测试
curl http://服务器IP
```

### 访问慢

```bash
# 排查步骤：
# 1. 测试网络延迟
ping 服务器IP

# 2. 测试下载速度
curl -o /dev/null -s -w "速度: %{speed_download} bytes/s\n" 文件URL

# 3. 检查 DNS 解析时间
dig example.com | grep "Query time"

# 4. 检查服务器负载
top
iostat -x 1

# 5. 检查带宽使用
iftop
nethogs
```

---

## 2.6 tcpdump 抓包

```bash
# 抓取所有包
tcpdump -i eth0

# 抓取特定端口
tcpdump -i eth0 port 80

# 抓取特定主机
tcpdump -i eth0 host 192.168.1.100

# 抓取 HTTP 请求
tcpdump -i eth0 -A 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'

# 保存到文件
tcpdump -i eth0 -w capture.pcap

# 读取抓包文件
tcpdump -r capture.pcap
```

---

## 要点总结

| 概念 | 工具 | 说明 |
|------|------|------|
| DNS 诊断 | `dig`、`nslookup` | DNS 解析测试 |
| 端口查看 | `ss`、`netstat` | 监听端口检查 |
| 防火墙 | `iptables`、`firewalld`、`ufw` | 流量控制 |
| 抓包分析 | `tcpdump` | 网络包分析 |
| HTTP 测试 | `curl` | API/网站测试 |

## 常见误区

1. **DNS 缓存问题**
   ```bash
   # 修改 DNS 后刷新缓存
   systemd-resolve --flush-caches
   ```

2. **iptables 规则顺序**
   ```bash
   # 规则按顺序匹配，放行规则要在拒绝之前
   iptables -A INPUT -p tcp --dport 22 -j ACCEPT  # 先放行
   iptables -A INPUT -j DROP                       # 最后拒绝
   ```

3. **502 错误不一定是 Nginx 问题**
   ```bash
   # 检查后端服务是否运行
   systemctl status php-fpm
   systemctl status gunicorn
   ```
