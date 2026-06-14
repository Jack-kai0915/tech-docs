# 第八章：常见服务错误调试分析

## 8.1 Web 服务类

### Nginx 502 Bad Gateway

```
🔴 错误现象
浏览器返回：502 Bad Gateway

🔍 分析
Nginx 作为反向代理，无法连接到后端服务

📋 错误日志
upstream prematurely closed connection while reading response header

✅ 排查步骤
1. 检查后端服务是否运行
2. 检查后端端口是否监听
3. 检查 upstream 配置
4. 检查防火墙规则

💡 解决方案
```

```bash
# 1. 检查后端服务
systemctl status your-app
# 或
docker ps | grep app

# 2. 检查端口
ss -tlnp | grep :3000

# 3. 测试后端连通性
curl http://127.0.0.1:3000

# 4. 检查 Nginx 错误日志
tail -100 /var/log/nginx/error.log
```

```
🛡️ 预防措施
• 设置后端健康检查
• 配置 upstream 超时
• 使用 keepalive 连接池
```

---

### Nginx 504 Gateway Timeout

```
🔴 错误现象
浏览器返回：504 Gateway Timeout

🔍 分析
后端服务响应时间超过 Nginx 超时设置

📋 错误日志
upstream timed out (110: Connection timed out)

✅ 解决方案
```

```nginx
# 增加超时时间
location / {
    proxy_pass http://backend;
    proxy_connect_timeout 60s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
}
```

```
🛡️ 预防措施
• 优化后端响应时间
• 设置合理的超时时间
• 使用异步处理长耗时任务
```

---

### Node.js EADDRINUSE

```
🔴 错误现象
Error: listen EADDRINUSE: address already in use :::3000

🔍 分析
端口 3000 已被其他进程占用

✅ 排查步骤
```

```bash
# 1. 查找占用端口的进程
lsof -i :3000
# 或
ss -tlnp | grep :3000

# 2. 终止进程
kill -9 <PID>

# 3. 或者使用其他端口
PORT=3001 node app.js
```

```
🛡️ 预防措施
• 使用端口配置文件
• 实现优雅关闭（Graceful Shutdown）
• 使用进程管理器（PM2）
```

---

## 8.2 数据库类

### MySQL Too many connections

```
🔴 错误现象
ERROR 1040 (08004): Too many connections

🔍 分析
MySQL 连接数达到 max_connections 限制

✅ 排查步骤
```

```sql
-- 查看当前连接数
SHOW STATUS LIKE 'Threads_connected';

-- 查看最大连接数
SHOW VARIABLES LIKE 'max_connections';

-- 查看连接状态
SHOW PROCESSLIST;

-- 临时增加连接数
SET GLOBAL max_connections = 500;
```

```
✅ 解决方案
```

```bash
# 修改配置文件 /etc/my.cnf
[mysqld]
max_connections = 500
wait_timeout = 600
interactive_timeout = 600

# 重启 MySQL
systemctl restart mysql
```

```
🛡️ 预防措施
• 使用连接池
• 设置 wait_timeout 自动断开空闲连接
• 监控连接数
```

---

### MySQL 主从同步延迟

```
🔴 错误现象
SHOW SLAVE STATUS\G 显示 Seconds_Behind_Master 很大

🔍 分析
从库应用 binlog 的速度跟不上主库写入速度

✅ 排查步骤
```

```sql
-- 查看从库状态
SHOW SLAVE STATUS\G

-- 检查是否有错误
SHOW SLAVE STATUS\G | grep -i error

-- 检查从库是否有慢查询
SHOW PROCESSLIST;
```

```
✅ 解决方案
• 检查从库是否有大事务
• 优化从库 SQL（添加索引）
• 检查网络延迟
• 考虑并行复制
```

---

### Redis OOM command not allowed

```
🔴 错误现象
OOM command not allowed when used memory > 'maxmemory'

🔍 分析
Redis 内存使用超过 maxmemory 限制

✅ 排查步骤
```

```bash
# 查看内存使用
redis-cli info memory

# 查看大 key
redis-cli --bigkeys

# 查看内存分布
redis-cli memory doctor
```

```
✅ 解决方案
```

```bash
# 1. 增加内存限制
redis-cli config set maxmemory 4gb

# 2. 清理大 key
redis-cli --bigkeys  # 找到大 key
redis-cli DEL <key>  # 删除

# 3. 设置淘汰策略
redis-cli config set maxmemory-policy allkeys-lru
```

```
🛡️ 预防措施
• 监控 Redis 内存使用
• 避免存储大 value
• 设置合理的过期时间
• 使用内存淘汰策略
```

---

## 8.3 容器与编排类

### Docker OOM Killed

```
🔴 错误现象
容器状态显示：OOMKilled

🔍 分析
容器内存使用超过 Docker 限制

✅ 排查步骤
```

```bash
# 查看容器状态
docker inspect <container> | grep -A 5 OOMKilled

# 查看内存限制
docker inspect <container> | grep Memory

# 实时监控
docker stats <container>
```

```
✅ 解决方案
```

```bash
# 1. 增加内存限制
docker run --memory="1g" my-app

# 2. 检查应用内存使用
docker stats <container>

# 3. 优化应用内存
# 查找内存泄漏
```

```
🛡️ 预防措施
• 设置合理的内存限制
• 监控容器内存使用
• 定期检查应用内存泄漏
```

---

### K8s Pod CrashLoopBackOff

```
🔴 错误现象
Pod 状态：CrashLoopBackOff

🔍 分析
Pod 启动后立即崩溃，K8s 不断重启

✅ 排查步骤
```

```bash
# 查看 Pod 状态
kubectl get pods
kubectl describe pod <pod-name>

# 查看容器日志
kubectl logs <pod-name>
kubectl logs <pod-name> --previous  # 上一次的日志

# 进入容器调试
kubectl exec -it <pod-name> -- /bin/sh
```

```
常见原因
• 启动命令错误
• 环境变量缺失
• 配置文件错误
• 依赖服务不可用
• 应用代码错误
```

---

### K8s ImagePullBackOff

```
🔴 错误现象
Pod 状态：ImagePullBackOff 或 ErrImagePull

🔍 分析
K8s 无法拉取容器镜像

✅ 排查步骤
```

```bash
# 查看 Pod 详情
kubectl describe pod <pod-name> | grep -A 5 Events

# 常见错误信息：
# - "pull access denied" → 镜像不存在
# - "unauthorized" → 认证失败
# - "timeout" → 网络问题

# 手动测试拉取
docker pull <image>
```

```
✅ 解决方案
• 检查镜像名称和标签
• 配置 imagePullSecrets
• 检查网络连通性
• 配置镜像加速器
```

---

### K8s Pending

```
🔴 错误现象
Pod 状态：Pending

🔍 分析
Pod 无法调度到任何节点

✅ 排查步骤
```

```bash
# 查看 Pod 详情
kubectl describe pod <pod-name> | grep -A 10 Events

# 常见原因
# 1. 资源不足
kubectl describe nodes | grep -A 5 "Allocated resources"

# 2. 节点污点
kubectl describe nodes | grep Taints

# 3. 亲和性不匹配
kubectl get pod <pod-name> -o yaml | grep -A 10 affinity
```

---

## 8.4 系统与网络类

### 磁盘 100% 满

```
🔴 错误现象
No space left on device

✅ 排查步骤
```

```bash
# 1. 查看磁盘使用
df -h

# 2. 查找大文件
du -sh /* | sort -rh | head -10
du -sh /var/log/* | sort -rh | head -10

# 3. 查找已删除但未释放的文件
lsof +L1

# 4. 清理日志
journalctl --vacuum-size=100M
truncate -s 0 /var/log/syslog

# 5. 清理 Docker
docker system prune -a
docker volume prune
```

```
🛡️ 预防措施
• 配置日志轮转
• 监控磁盘使用
• 设置磁盘告警
• 定期清理临时文件
```

---

### Load Average 飙高

```
🔴 错误现象
load average: 15.00, 12.00, 8.00

🔍 分析
系统负载过高，可能原因：
• CPU 密集型任务
• IO 等待
• 僵尸进程

✅ 排查步骤
```

```bash
# 1. 查看 CPU 使用
top -c

# 2. 查看 IO 等待
iostat -x 1

# 3. 查找 CPU 占用高的进程
ps aux --sort=-%cpu | head -10

# 4. 查找僵尸进程
ps aux | grep -w Z

# 5. 查看系统调用
strace -p <PID>
```

---

### TCP TIME_WAIT 过多

```
🔴 错误现象
netstat 显示大量 TIME_WAIT 状态连接

✅ 排查步骤
```

```bash
# 统计连接状态
ss -an | awk '{print $1}' | sort | uniq -c | sort -rn

# 输出示例：
#   5000 TIME-WAIT
#   1000 ESTABLISHED
#    100 LISTEN
```

```
✅ 解决方案
```

```bash
# 修改内核参数
cat >> /etc/sysctl.conf << EOF
# 启用 TIME_WAIT 快速回收
net.ipv4.tcp_tw_reuse = 1
# 允许系统重用 TIME_WAIT 连接
net.ipv4.tcp_fin_timeout = 30
# 增大端口范围
net.ipv4.ip_local_port_range = 1024 65535
EOF

# 生效
sysctl -p
```

---

## 8.5 通用排查思路

```
故障排查流程
├── 1. 确认问题 → 现象是什么？影响范围？
├── 2. 收集信息 → 日志、监控、指标
├── 3. 分析原因 → 可能的原因有哪些？
├── 4. 验证假设 → 逐一排除
├── 5. 解决问题 → 临时方案 + 根本解决
└── 6. 总结预防 → 写入文档、配置告警
```

### 常用排查命令速查

| 问题 | 命令 | 说明 |
|------|------|------|
| 端口占用 | `ss -tlnp \| grep :80` | 查看监听端口 |
| 进程问题 | `ps aux \| grep nginx` | 查看进程 |
| 磁盘满 | `df -h` | 查看磁盘使用 |
| 内存不足 | `free -h` | 查看内存使用 |
| CPU 高 | `top -c` | 查看 CPU 使用 |
| 网络问题 | `ping`、`curl`、`traceroute` | 网络诊断 |
| 日志分析 | `tail -f`、`grep` | 日志查看 |
