# 第一章：运维基础与工具链

## 1.1 运维的核心职责

```
运维工程师的核心职责
├── 系统稳定性 → 保障服务 7×24 小时可用
├── 性能优化   → 提升系统响应速度和吞吐量
├── 安全防护   → 防范攻击、数据泄露
├── 自动化     → 减少人工操作、提高效率
└── 成本控制   → 优化资源使用、降低开支
```

---

## 1.2 Linux 常用运维工具

| 类别 | 工具 | 用途 |
|------|------|------|
| **远程管理** | SSH、tmux、screen | 远程登录、会话管理 |
| **文件操作** | rsync、scp、tar | 文件传输、备份 |
| **进程管理** | ps、top、htop、kill | 查看和管理进程 |
| **磁盘管理** | df、du、fdisk、lvm | 磁盘空间和分区 |
| **网络工具** | ping、curl、wget、netstat | 网络诊断和下载 |
| **日志分析** | journalctl、grep、awk | 日志查看和分析 |
| **性能监控** | vmstat、iostat、sar | 系统性能分析 |

---

## 1.3 SSH 与远程管理

### SSH 基础连接

```bash
# 基本连接
ssh user@192.168.1.100

# 指定端口
ssh -p 2222 user@192.168.1.100

# 使用密钥登录
ssh -i ~/.ssh/id_rsa user@192.168.1.100

# 执行远程命令
ssh user@192.168.1.100 "df -h"
```

### SSH 配置文件

```bash
# 编辑配置文件
vim ~/.ssh/config

# 配置示例
Host myserver
    HostName 192.168.1.100
    User deploy
    Port 22
    IdentityFile ~/.ssh/id_rsa

# 使用别名连接
ssh myserver
```

### SSH 密钥管理

```bash
# 生成密钥对
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥到服务器
ssh-copy-id user@192.168.1.100

# 验证免密登录
ssh user@192.168.1.100
```

---

## 1.4 文件权限与用户管理

### 权限基础

```bash
# 查看权限
ls -la
# 输出示例：
# -rwxr-xr-- 1 user group 4096 Jan 15 10:00 file.txt
#  │└┬┘└┬┘└┬┘
#  │ │  │  └── 其他用户权限
#  │ │  └───── 所属组权限
#  │ └──────── 所有者权限
#  └────────── 文件类型（-文件 d目录 l链接）

# 修改权限
chmod 755 file.sh      # 数字模式：rwxr-xr-x
chmod u+x file.sh      # 符号模式：给所有者添加执行权限
chmod -R 644 /var/www  # 递归修改目录

# 修改所有者
chown user:group file.txt
chown -R www:www /var/www
```

### 权限数字对照

```
数字  权限  含义
0     ---   无权限
1     --x   执行
2     -w-   写入
3     -wx   写入+执行
4     r--   读取
5     r-x   读取+执行
6     rw-   读取+写入
7     rwx   读取+写入+执行
```

### 用户管理

```bash
# 添加用户
useradd -m -s /bin/bash newuser
passwd newuser

# 添加到 sudo 组
usermod -aG sudo newuser

# 删除用户
userdel -r olduser

# 查看用户信息
id user
whoami
```

### sudoers 配置

```bash
# 编辑 sudoers 文件（必须用 visudo）
visudo

# 允许用户执行所有命令
username ALL=(ALL:ALL) ALL

# 允许用户免密码执行特定命令
username ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx

# 允许组执行所有命令
%admin ALL=(ALL:ALL) ALL
```

---

## 1.5 进程管理与资源监控

### 进程查看

```bash
# 查看所有进程
ps aux

# 查看特定进程
ps aux | grep nginx

# 查看进程树
pstree

# 查看进程详细信息
ps -ef | grep java
```

### 进程管理

```bash
# 终止进程
kill PID            # 发送 SIGTERM（优雅终止）
kill -9 PID         # 发送 SIGKILL（强制终止）
killall nginx       # 按名称终止
pkill -f "python app.py"  # 按命令模式终止

# 后台运行
nohup command &     # 后台运行，不受终端关闭影响
jobs                # 查看后台任务
fg %1               # 将任务调到前台
```

### 资源监控

```bash
# CPU 和内存
top                 # 实时监控
htop                # 增强版 top（需安装）
free -h             # 内存使用情况
# 输出示例：
#               total        used        free      shared  buff/cache   available
# Mem:          7.7G        2.1G        1.2G        256M        4.4G        5.1G
# Swap:         2.0G          0B        2.0G

# 磁盘
df -h               # 磁盘空间使用
du -sh /var/log     # 目录大小
du -sh * | sort -rh | head -10  # 当前目录最大的10个文件/目录

# IO 监控
iostat -x 1         # 磁盘 IO 统计（每秒刷新）
iotop               # 进程 IO 排行（需安装）
```

---

## 1.6 日志管理

### systemd 日志

```bash
# 查看系统日志
journalctl

# 查看特定服务日志
journalctl -u nginx
journalctl -u docker

# 实时跟踪日志
journalctl -u nginx -f

# 按时间筛选
journalctl --since "2024-01-15 10:00" --until "2024-01-15 12:00"
journalctl -u nginx --since "1 hour ago"

# 查看启动日志
journalctl -b           # 本次启动
journalctl -b -1        # 上次启动
```

### 日志文件

```bash
# 常见日志文件
/var/log/syslog         # 系统日志（Ubuntu/Debian）
/var/log/messages       # 系统日志（CentOS/RHEL）
/var/log/auth.log       # 认证日志
/var/log/secure         # 安全日志（CentOS/RHEL）
/var/log/nginx/         # Nginx 日志
/var/log/mysql/         # MySQL 日志
```

### 日志分析

```bash
# 搜索日志
grep "error" /var/log/nginx/error.log
grep -i "error" /var/log/syslog

# 统计错误次数
grep -c "error" /var/log/nginx/error.log

# 查看最近的错误
tail -100 /var/log/nginx/error.log | grep "error"

# 实时跟踪
tail -f /var/log/nginx/access.log

# 日志轮转
cat /etc/logrotate.d/nginx
```

---

## 1.7 网络诊断工具

### 基本诊断

```bash
# 测试连通性
ping -c 4 google.com

# 路由追踪
traceroute google.com
# 或使用 mtr（更详细）
mtr google.com

# DNS 解析
dig google.com
nslookup google.com
host google.com

# 测试端口连通性
telnet 192.168.1.100 80
nc -zv 192.168.1.100 80

# 查看网络接口
ip addr show
ifconfig

# 查看路由表
ip route show
route -n
```

### 网络连接

```bash
# 查看监听端口
netstat -tlnp
# 或使用 ss（推荐）
ss -tlnp

# 查看网络连接
ss -anp
netstat -anp

# 统计连接状态
ss -an | awk '{print $1}' | sort | uniq -c | sort -rn
```

### curl 和 wget

```bash
# curl - HTTP 请求测试
curl -I https://example.com           # 只返回头信息
curl -v https://example.com           # 详细输出
curl -o file.txt https://example.com  # 下载文件
curl -X POST -d "data" https://api.example.com  # POST 请求

# wget - 下载文件
wget https://example.com/file.zip
wget -c https://example.com/file.zip  # 断点续传
wget -r https://example.com/          # 递归下载
```

---

## 要点总结

| 类别 | 常用命令 | 说明 |
|------|----------|------|
| 远程管理 | `ssh`、`scp` | 安全连接和文件传输 |
| 文件权限 | `chmod`、`chown` | 权限和所有者管理 |
| 进程管理 | `ps`、`top`、`kill` | 查看和管理进程 |
| 磁盘管理 | `df`、`du` | 磁盘空间查看 |
| 网络诊断 | `ping`、`curl`、`ss` | 网络连通性测试 |
| 日志管理 | `journalctl`、`tail` | 日志查看和分析 |

## 常见误区

1. **不要随意使用 `kill -9`**
   ```bash
   # 先尝试优雅终止
   kill PID
   # 等待几秒后，如果没响应再强制
   kill -9 PID
   ```

2. **`rm -rf` 要格外小心**
   ```bash
   # ❌ 危险操作
   rm -rf /           # 删除整个系统！
   rm -rf *           # 删除当前目录所有内容
   
   # ✅ 安全做法
   rm -rf ./dir       # 明确指定路径
   ls dir/            # 先确认内容
   ```

3. **编辑文件前先备份**
   ```bash
   cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
   ```
