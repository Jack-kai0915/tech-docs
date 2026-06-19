# Windows 11 终端命令大全

## 目录

- [终端基础](#终端基础)
- [文件与目录操作](#文件与目录操作)
- [系统信息查询](#系统信息查询)
- [进程管理](#进程管理)
- [网络管理](#网络管理)
- [磁盘管理](#磁盘管理)
- [用户与权限管理](#用户与权限管理)
- [服务管理](#服务管理)
- [系统配置](#系统配置)
- [PowerShell 进阶](#powershell-进阶)

---

## 终端基础

### 打开终端的方式

```
快捷键：
• Win + X → 终端（管理员）
• Win + R → 输入 cmd / powershell
• Win + S → 搜索"终端"

右键菜单：
• 文件夹空白处 → 在终端中打开
```

### 终端切换

```powershell
# 从 PowerShell 切换到 CMD
cmd

# 从 CMD 切换到 PowerShell
powershell

# 查看当前使用的 shell
$PSVersionTable  # PowerShell
echo %COMSPEC%   # CMD
```

### 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 自动补全命令/路径 |
| `Ctrl + C` | 中断当前命令 |
| `Ctrl + V` | 粘贴 |
| `Ctrl + L` | 清屏（CMD） |
| `F7` | 查看历史命令 |
| `↑/↓` | 浏览历史命令 |

---

## 文件与目录操作

### 基本操作

```powershell
# 查看当前目录
cd
pwd                    # PowerShell

# 列出文件
dir                    # CMD
ls                     # PowerShell
dir /a                 # 显示隐藏文件

# 切换目录
cd C:\Users
cd ..                  # 上一级
cd \                   # 回到根目录

# 创建目录
mkdir new-folder
mkdir -p a/b/c         # PowerShell 递归创建

# 删除目录
rmdir folder           # 删除空目录
rmdir /s folder        # CMD 删除非空目录
Remove-Item -Recurse folder  # PowerShell

# 复制文件
copy file.txt backup.txt
Copy-Item file.txt backup.txt  # PowerShell

# 移动/重命名
move old.txt new.txt
Move-Item old.txt new.txt  # PowerShell

# 删除文件
del file.txt
Remove-Item file.txt  # PowerShell
del *.log             # 删除所有 log 文件
```

### 查找文件

```powershell
# 查找文件
dir /s /b *.log        # CMD 递归查找
Get-ChildItem -Recurse -Filter *.log  # PowerShell

# 查找包含特定内容的文件
findstr /s "error" *.log  # CMD
Select-String -Path *.log -Pattern "error"  # PowerShell

# 查看文件内容
type file.txt          # CMD
Get-Content file.txt   # PowerShell
cat file.txt           # PowerShell 简写
```

### 文件内容操作

```powershell
# 查看文件（分页）
more file.txt
Get-Content file.txt -Wait  # 实时查看

# 搜索文本
find "keyword" file.txt     # CMD
Select-String "keyword" file.txt  # PowerShell

# 文件大小
dir file.txt               # CMD 查看
(Get-Item file.txt).Length # PowerShell 精确字节

# 统计行数
find /c /v "" file.txt     # CMD
(Get-Content file.txt).Count  # PowerShell
```

### 通配符

```powershell
*       # 匹配任意字符
?       # 匹配单个字符
[abc]   # 匹配括号内字符
[0-9]   # 匹配数字范围

# 示例
dir *.txt                 # 所有 txt 文件
dir file?.txt             # file1.txt, file2.txt 等
dir [abc]*.txt            # a.txt, b.txt, c.txt 等
```

---

## 系统信息查询

### 基本信息

```powershell
# 系统信息
systeminfo
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"  # 只看系统版本

# 主机名
hostname
echo %COMPUTERNAME%    # CMD
$env:COMPUTERNAME      # PowerShell

# 当前用户
whoami
echo %USERNAME%        # CMD
$env:USERNAME          # PowerShell

# 时间和日期
date /t                # CMD
time /t                # CMD
Get-Date               # PowerShell

# 环境变量
echo %PATH%            # CMD
$env:PATH              # PowerShell
[Environment]::GetEnvironmentVariable("PATH")
```

### 硬件信息

```powershell
# CPU 信息
wmic cpu get name, numberOfCores, numberOfLogicalProcessors
Get-CimInstance -ClassName Win32_Processor | Select-Object Name, NumberOfCores

# 内存信息
wmic memorychip get capacity, speed
Get-CimInstance -ClassName Win32_PhysicalMemory | Select-Object Capacity, Speed

# 磁盘信息
wmic diskdrive get model, size, status
Get-PhysicalDisk | Select-Object FriendlyName, Size, HealthStatus

# 显卡信息
wmic path win32_VideoController get name, adapterram
Get-CimInstance -ClassName Win32_VideoController | Select-Object Name, AdapterRAM

# 主板信息
wmic baseboard get manufacturer, product
Get-CimInstance -ClassName Win32_BaseBoard | Select-Object Manufacturer, Product
```

### 性能信息

```powershell
# CPU 使用率
wmic cpu get loadpercentage
Get-CimInstance -ClassName Win32_Processor | Select-Object LoadPercentage

# 内存使用
systeminfo | findstr "Memory"
Get-CimInstance -ClassName Win32_OperatingSystem | 
    Select-Object @{N='TotalMemory(GB)';E={[math]::Round($_.TotalVisibleMemorySize/1MB,2)}},
                  @{N='FreeMemory(GB)';E={[math]::Round($_.FreePhysicalMemory/1MB,2)}}

# 运行时间
systeminfo | findstr "Boot Time"
(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime
```

---

## 进程管理

### 查看进程

```powershell
# 列出所有进程
tasklist
Get-Process

# 查看特定进程
tasklist | findstr chrome
Get-Process -Name chrome

# 按 CPU 排序
tasklist /FI "STATUS eq running" /FO TABLE
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# 按内存排序
tasklist /FI "MEMUSAGE gt 100000"
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10

# 查看进程详细信息
wmic process where name="chrome.exe" get ProcessId, CommandLine
Get-Process -Name chrome | Select-Object Id, ProcessName, CPU, WorkingSet
```

### 结束进程

```powershell
# 按名称结束
taskkill /IM chrome.exe
taskkill /IM chrome.exe /F    # 强制结束

# 按 PID 结束
taskkill /PID 1234
taskkill /PID 1234 /F

# 结束进程树
taskkill /IM chrome.exe /T

# PowerShell 结束
Stop-Process -Name chrome
Stop-Process -Id 1234 -Force
```

### 启动程序

```powershell
# 后台启动
start notepad.exe
Start-Process notepad

# 最小化启动
start /MIN notepad.exe
Start-Process notepad -WindowStyle Minimized

# 最大化启动
start /MAX notepad.exe
Start-Process notepad -WindowStyle Maximized

# 指定参数启动
start chrome.exe "https://google.com"
Start-Process chrome -ArgumentList "https://google.com"
```

### 计划任务

```powershell
# 查看计划任务
schtasks /query
Get-ScheduledTask

# 创建计划任务
schtasks /create /tn "MyTask" /tr "C:\script.bat" /sc daily /st 09:00
Register-ScheduledTask -Action (New-ScheduledTaskAction -Execute "C:\script.bat") `
    -Trigger (New-ScheduledTaskTrigger -Daily -At 9am) `
    -TaskName "MyTask"

# 删除计划任务
schtasks /delete /tn "MyTask" /f
Unregister-ScheduledTask -TaskName "MyTask"

# 立即运行任务
schtasks /run /tn "MyTask"
Start-ScheduledTask -TaskName "MyTask"
```

---

## 网络管理

### 基本网络查询

```powershell
# 查看 IP 地址
ipconfig
ipconfig /all             # 详细信息
Get-NetIPAddress          # PowerShell

# 查看网络适配器
ipconfig /all
Get-NetAdapter | Select-Object Name, Status, MacAddress

# 刷新 DNS 缓存
ipconfig /flushdns
Clear-DnsClientCache

# 查看 DNS 服务器
ipconfig /all | findstr "DNS"
Get-DnsClientServerAddress

# Ping 测试
ping google.com
ping -t google.com        # 持续 ping
ping -n 4 8.8.8.8        # 指定次数

# 路由追踪
tracert google.com
Test-NetConnection google.com -TraceRoute
```

### 网络连接

```powershell
# 查看监听端口
netstat -an | findstr LISTENING
Get-NetTCPConnection -State Listen

# 查看所有连接
netstat -an
Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, State

# 查看特定端口
netstat -an | findstr :80
Get-NetTCPConnection -LocalPort 80

# 查看进程占用的端口
netstat -ano | findstr :80
Get-NetTCPConnection -LocalPort 80 | Select-Object OwningProcess

# 查看进程对应的端口
netstat -ano | findstr LISTENING
for /f "tokens=5" %a in ('netstat -ano ^| findstr LISTENING') do tasklist /FI "PID eq %a"
```

### 网络配置

```powershell
# 释放 IP
ipconfig /release
Release-NetIPAddress

# 更新 IP
ipconfig /renew
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress "192.168.1.100"

# 设置静态 IP
netsh interface ip set address "Ethernet" static 192.168.1.100 255.255.255.0 192.168.1.1
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress "192.168.1.100" -PrefixLength 24 -DefaultGateway "192.168.1.1"

# 设置 DNS
netsh interface ip set dns "Ethernet" static 8.8.8.8
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses "8.8.8.8","8.8.4.4"

# 查看路由表
route print
Get-NetRoute

# 添加静态路由
route add 10.0.0.0 mask 255.0.0.0 192.168.1.1
New-NetRoute -DestinationPrefix "10.0.0.0/8" -NextHop "192.168.1.1"
```

### 防火墙

```powershell
# 查看防火墙状态
netsh advfirewall show allprofiles
Get-NetFirewallProfile | Select-Object Name, Enabled

# 添加入站规则
netsh advfirewall firewall add rule name="My App" dir=in action=allow program="C:\app.exe"
New-NetFirewallRule -DisplayName "My App" -Direction Inbound -Program "C:\app.exe" -Action Allow

# 添加端口规则
netsh advfirewall firewall add rule name="HTTP" dir=in action=allow protocol=tcp localport=80
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

# 删除规则
netsh advfirewall firewall delete rule name="My App"
Remove-NetFirewallRule -DisplayName "My App"

# 查看规则
netsh advfirewall firewall show rule name=all
Get-NetFirewallRule | Select-Object DisplayName, Direction, Action
```

---

## 磁盘管理

### 查看磁盘

```powershell
# 查看磁盘分区
diskpart → list disk
Get-Disk | Select-Object Number, FriendlyName, Size, HealthStatus

# 查看分区
Get-Partition | Select-Object DiskNumber, PartitionNumber, Size, DriveLetter

# 查看卷
Get-Volume | Select-Object DriveLetter, FileSystemLabel, FileSystem, Size

# 检查磁盘
chkdsk C:
chkdsk C: /F /R          # 修复错误并恢复坏扇区

# 磁盘清理
cleanmgr
```

### 磁盘空间

```powershell
# 查看磁盘空间
wmic logicaldisk get caption, size, freespace
Get-PSDrive | Select-Object Name, @{N='Used(GB)';E={[math]::Round($_.Used/1GB,2)}}, @{N='Free(GB)';E={[math]::Round($_.Free/1GB,2)}}

# 查找大文件
dir /s /o-s C:\*.log
Get-ChildItem -Path C:\ -Recurse -File | Sort-Object Length -Descending | Select-Object -First 10 FullName, @{N='Size(MB)';E={[math]::Round($_.Length/1MB,2)}}

# 清理临时文件
del /s /q %temp%\*
Remove-Item -Path $env:TEMP\* -Recurse -Force

# 查看磁盘使用率
wmic logicaldisk get caption, size, freespace /format:csv
```

### 磁盘格式化

```powershell
# ⚠️ 警告：格式化会删除所有数据！

# 使用 diskpart
diskpart
select disk 1
clean
create partition primary
format fs=ntfs quick
assign letter=D

# PowerShell 格式化
Format-Volume -DriveLetter D -FileSystem NTFS -NewFileSystemLabel "Data"

# 文件系统类型
# NTFS - Windows 默认，支持大文件、权限
# FAT32 - 兼容性好，单文件最大 4GB
# exFAT - 闪存设备常用，支持大文件
# ReFS - 新一代文件系统
```

---

## 用户与权限管理

### 用户管理

```powershell
# 查看所有用户
net user
Get-LocalUser

# 查看用户详情
net user username
Get-LocalUser -Name "username"

# 创建用户
net user newuser password /add
New-LocalUser -Name "newuser" -Password (ConvertTo-SecureString "password" -AsPlainText -Force)

# 删除用户
net user newuser /delete
Remove-LocalUser -Name "newuser"

# 修改密码
net user newuser newpassword

# 禁用/启用用户
net user newuser /active:no
net user newuser /active:yes
Disable-LocalUser -Name "newuser"
Enable-LocalUser -Name "newuser"
```

### 组管理

```powershell
# 查看所有组
net localgroup
Get-LocalGroup

# 将用户添加到组
net localgroup Administrators newuser /add
Add-LocalGroupMember -Group "Administrators" -Member "newuser"

# 从组中移除用户
net localgroup Administrators newuser /delete
Remove-LocalGroupMember -Group "Administrators" -Member "newuser"

# 查看组成员
net localgroup Administrators
Get-LocalGroupMember -Group "Administrators"
```

### 权限管理

```powershell
# 查看文件权限
icacls file.txt
Get-Acl file.txt | Format-List

# 修改权限
icacls file.txt /grant Users:F        # 完全控制
icacls file.txt /grant Users:R        # 只读
icacls file.txt /deny Users:W         # 拒绝写入
icacls file.txt /remove Users         # 移除权限

# 取得所有权
takeown /f file.txt
takeown /f C:\folder /r /d y

# 管理员权限运行
# 右键 → 以管理员身份运行
# 或
Start-Process powershell -Verb RunAs
```

---

## 服务管理

### 查看服务

```powershell
# 查看所有服务
net start
Get-Service

# 查看特定服务
sc query spooler
Get-Service -Name "spooler"

# 查看服务状态
sc query spooler | findstr STATE
Get-Service -Name "spooler" | Select-Object Name, Status

# 查看服务详细信息
sc qc spooler
Get-Service -Name "spooler" | Format-List *
```

### 启动/停止服务

```powershell
# 启动服务
net start spooler
Start-Service -Name "spooler"

# 停止服务
net stop spooler
Stop-Service -Name "spooler"

# 重启服务
net stop spooler && net start spooler
Restart-Service -Name "spooler"

# 暂停服务
sc pause spooler
Suspend-Service -Name "spooler"
```

### 服务配置

```powershell
# 设置启动类型
sc config spooler start=auto      # 自动
sc config spooler start=demand    # 手动
sc config spooler start=disabled  # 禁用
Set-Service -Name "spooler" -StartupType Automatic

# 创建服务
sc create MyService binPath= "C:\MyService.exe" start= auto
New-Service -Name "MyService" -BinaryPathName "C:\MyService.exe" -StartupType Automatic

# 删除服务
sc delete MyService
Remove-Service -Name "MyService"
```

### 常用服务

| 服务名 | 功能 |
|--------|------|
| `wuauserv` | Windows 更新 |
| `spooler` | 打印服务 |
| `WSearch` | Windows 搜索 |
| `Dhcp` | DHCP 客户端 |
| `Dnscache` | DNS 客户端 |
| `WinDefend` | Windows Defender |
| `W32Time` | 时间同步 |
| `WlanSvc` | WLAN 服务 |

---

## 系统配置

### 环境变量

```powershell
# 查看环境变量
echo %PATH%                    # CMD
$env:PATH                      # PowerShell
[Environment]::GetEnvironmentVariable("PATH")

# 设置临时环境变量（当前会话）
$env:MY_VAR = "hello"

# 设置永久环境变量
[Environment]::SetEnvironmentVariable("MY_VAR", "hello", "User")
[Environment]::SetEnvironmentVariable("MY_VAR", "hello", "Machine")

# 添加到 PATH
$env:PATH += ";C:\MyTools"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\MyTools", "User")

# 删除环境变量
[Environment]::SetEnvironmentVariable("MY_VAR", $null, "User")
```

### 系统配置工具

```powershell
# 系统配置
msconfig

# 注册表编辑器
regedit

# 设备管理器
devmgmt.msc

# 磁盘管理
diskmgmt.msc

# 服务管理
services.msc

# 事件查看器
eventvwr.msc

# 计算器
calc

# 记事本
notepad

# 画图
mspaint
```

### 启动项管理

```powershell
# 查看启动项
wmic startup list full
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location

# 禁用启动项（使用任务管理器）
# Ctrl + Shift + Esc → 启动选项卡

# 添加启动项
New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" `
    -Name "MyApp" -Value "C:\MyApp.exe"

# 删除启动项
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" `
    -Name "MyApp"
```

---

## PowerShell 进阶

### 管道和过滤

```powershell
# 管道
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5

# 过滤
Get-Process | Where-Object {$_.CPU -gt 100}

# 格式化输出
Get-Process | Format-Table Name, CPU, WorkingSet
Get-Process | Format-List *
Get-Process | Format-Custom

# 导出到文件
Get-Process | Export-Csv -Path "processes.csv" -NoTypeInformation
Get-Process | Out-File "processes.txt"
```

### 对象操作

```powershell
# 获取属性
$process = Get-Process -Name "chrome" | Select-Object -First 1
$process.Name
$process.CPU

# 遍历
$processes = Get-Process | Select-Object -First 5
foreach ($p in $processes) {
    Write-Host "$($p.Name): $($p.CPU)"
}

# 管道操作
Get-Process | ForEach-Object { Write-Host $_.Name }

# 计算属性
Get-Process | Select-Object Name, @{N='CPU(%)';E={$_.CPU}}
```

### 脚本编写

```powershell
# 保存为 .ps1 文件
# 运行：.\script.ps1

# 参数
param(
    [string]$Name,
    [int]$Count = 1
)

Write-Host "Hello, $Name! Count: $Count"

# 条件
if ($Count -gt 0) {
    Write-Host "Positive"
} elseif ($Count -lt 0) {
    Write-Host "Negative"
} else {
    Write-Host "Zero"
}

# 循环
foreach ($i in 1..5) {
    Write-Host $i
}

# 函数
function Get-Factorial($n) {
    if ($n -le 1) { return 1 }
    return $n * (Get-Factorial($n - 1))
}

# 错误处理
try {
    $result = 1 / 0
} catch {
    Write-Host "Error: $_"
} finally {
    Write-Host "Done"
}
```

### 常用命令速查

```powershell
# 获取帮助
Get-Help Get-Process
Get-Help Get-Process -Examples

# 别名
Get-Alias gcm    # 查看命令别名
Set-Alias ll Get-ChildItem  # 设置别名

# 命令历史
Get-History
Invoke-History 5

# 执行策略
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned

# 安装模块
Install-Module -Name "ModuleName" -Scope CurrentUser
Import-Module "ModuleName"
Get-InstalledModule
```

---

## 实用脚本示例

### 批量重命名文件

```powershell
# 批量添加前缀
Get-ChildItem *.txt | Rename-Item -NewName { "prefix_" + $_.Name }

# 批量替换扩展名
Get-ChildItem *.jpeg | Rename-Item -NewName { $_.Name -replace '\.jpeg$', '.jpg' }

# 序号命名
$counter = 1
Get-ChildItem *.jpg | ForEach-Object {
    Rename-Item $_.FullName -NewName ("photo_{0:D3}.jpg" -f $counter++)
}
```

### 系统清理脚本

```powershell
# 清理临时文件
function Clear-TempFiles {
    $tempPaths = @(
        $env:TEMP,
        "C:\Windows\Temp",
        "C:\Windows\Prefetch"
    )
    
    foreach ($path in $tempPaths) {
        if (Test-Path $path) {
            Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "已清理: $path"
        }
    }
}

# 清理回收站
Clear-RecycleBin -Force -ErrorAction SilentlyContinue
```

### 自动备份脚本

```powershell
# 备份文件
function Backup-Files {
    param(
        [string]$Source,
        [string]$Destination
    )
    
    $date = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = Join-Path $Destination "backup_$date"
    
    New-Item -ItemType Directory -Path $backupPath -Force
    Copy-Item -Path $Source -Destination $backupPath -Recurse
    
    Write-Host "备份完成: $backupPath"
}

# 使用
Backup-Files -Source "C:\Important" -Destination "D:\Backups"
```

### 进程监控脚本

```powershell
# 监控进程并发送告警
function Monitor-Process {
    param(
        [string]$ProcessName,
        [int]$Threshold = 80
    )
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    
    foreach ($proc in $processes) {
        if ($proc.CPU -gt $Threshold) {
            Write-Warning "进程 $($proc.Name) (PID: $($proc.Id)) CPU 使用率过高: $($proc.CPU)%"
        }
    }
}

# 使用
Monitor-Process -ProcessName "chrome" -Threshold 100
```

---

## 常用命令速查表

| 功能 | CMD 命令 | PowerShell 命令 |
|------|----------|-----------------|
| 列出文件 | `dir` | `ls` / `Get-ChildItem` |
| 复制文件 | `copy` | `Copy-Item` |
| 移动文件 | `move` | `Move-Item` |
| 删除文件 | `del` | `Remove-Item` |
| 创建目录 | `mkdir` | `New-Item -ItemType Directory` |
| 查看内容 | `type` | `Get-Content` |
| 搜索文本 | `findstr` | `Select-String` |
| 查看进程 | `tasklist` | `Get-Process` |
| 结束进程 | `taskkill` | `Stop-Process` |
| 网络配置 | `ipconfig` | `Get-NetIPAddress` |
| Ping | `ping` | `Test-Connection` |
| 查看服务 | `net start` | `Get-Service` |
| 启动服务 | `net start` | `Start-Service` |
| 停止服务 | `net stop` | `Stop-Service` |
| 环境变量 | `echo %VAR%` | `$env:VAR` |
| 别名 | DOSKEY | `Get-Alias` |

---

## 常见问题

### PowerShell 执行策略

```powershell
# 查看当前策略
Get-ExecutionPolicy

# 设置策略
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 常见策略
Restricted    # 禁止所有脚本
RemoteSigned  # 本地脚本可执行
Unrestricted  # 所有脚本可执行（不推荐）
Bypass        # 完全绕过（不推荐）
```

### 路径问题

```powershell
# 路径中包含空格时加引号
cd "C:\Program Files"

# UNC 路径
\\server\share\folder

# 路径分隔符
# Windows 用 \
# PowerShell 也支持 /
```

### 编码问题

```powershell
# 查看文件编码
Get-Content file.txt -Encoding Byte -TotalCount 3

# 指定编码读取
Get-Content file.txt -Encoding UTF8

# 转换编码
Get-Content file.txt -Encoding UTF8 | Set-Content file_new.txt -Encoding UTF8
```
