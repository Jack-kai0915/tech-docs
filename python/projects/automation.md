# 自动化脚本

## 项目概述

使用 Python 编写自动化脚本，提高工作效率。

## 文件批量处理

### 批量重命名

```python
import os
from pathlib import Path

def batch_rename(directory, pattern, extension=None):
    """批量重命名文件
    
    Args:
        directory: 目标目录
        pattern: 新文件名模式（如 'photo_{:03d}'）
        extension: 文件扩展名过滤（如 '.jpg'）
    """
    path = Path(directory)
    files = sorted(path.iterdir())
    
    if extension:
        files = [f for f in files if f.suffix.lower() == extension.lower()]
    
    for i, file in enumerate(files):
        new_name = pattern.format(i + 1) + file.suffix
        new_path = file.parent / new_name
        file.rename(new_path)
        print(f"重命名: {file.name} -> {new_name}")

# 使用
batch_rename('./photos', 'vacation_{:03d}', '.jpg')
```

### 批量格式转换

```python
import os
from pathlib import Path
from PIL import Image

def batch_convert_images(input_dir, output_dir, target_format='PNG'):
    """批量转换图片格式"""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    for file in input_path.glob('*.*'):
        if file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.bmp', '.gif']:
            img = Image.open(file)
            output_file = output_path / f"{file.stem}.{target_format.lower()}"
            img.save(output_file, target_format)
            print(f"转换: {file.name} -> {output_file.name}")

# 使用
batch_convert_images('./photos', './converted', 'PNG')
```

## 网络自动化

### 网页抓取

```python
import requests
from bs4 import BeautifulSoup
import csv

def scrape_news(url):
    """抓取新闻标题"""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    titles = []
    for item in soup.find_all('h2', class_='title'):
        titles.append(item.text.strip())
    
    return titles

def save_to_csv(data, filename):
    """保存数据到 CSV"""
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Title'])
        for title in data:
            writer.writerow([title])

# 使用
titles = scrape_news('https://example.com/news')
save_to_csv(titles, 'news.csv')
```

### 自动登录

```python
import requests
from bs4 import BeautifulSoup

class WebScraper:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
    
    def login(self, login_url, credentials):
        """登录网站"""
        # 获取登录页面的 CSRF token
        response = self.session.get(login_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        token = soup.find('input', {'name': 'csrf_token'})['value']
        
        # 添加 token 到凭证
        credentials['csrf_token'] = token
        
        # 提交登录表单
        response = self.session.post(login_url, data=credentials)
        return response.status_code == 200
    
    def get_page(self, url):
        """获取页面内容"""
        response = self.session.get(url)
        return BeautifulSoup(response.text, 'html.parser')

# 使用
scraper = WebScraper('https://example.com')
scraper.login('https://example.com/login', {
    'username': 'user',
    'password': 'pass'
})
page = scraper.get_page('https://example.com/dashboard')
```

## 数据处理自动化

### Excel 报告生成

```python
import pandas as pd
from datetime import datetime
import os

def generate_monthly_report(data_file, output_dir):
    """生成月度报告"""
    # 读取数据
    df = pd.read_csv(data_file)
    df['日期'] = pd.to_datetime(df['日期'])
    
    # 按月统计
    df['月份'] = df['日期'].dt.to_period('M')
    monthly_stats = df.groupby('月份').agg({
        '销量': 'sum',
        '销售额': 'sum',
        '利润': 'sum'
    }).round(2)
    
    # 生成 Excel 报告
    output_file = os.path.join(output_dir, f"报告_{datetime.now().strftime('%Y%m')}.xlsx")
    
    with pd.ExcelWriter(output_file) as writer:
        monthly_stats.to_excel(writer, sheet_name='月度统计')
        
        # 按产品统计
        product_stats = df.groupby('产品').agg({
            '销量': 'sum',
            '销售额': 'sum'
        })
        product_stats.to_excel(writer, sheet_name='产品统计')
        
        # 按地区统计
        region_stats = df.groupby('地区').agg({
            '销量': 'sum',
            '销售额': 'sum'
        })
        region_stats.to_excel(writer, sheet_name='地区统计')
    
    print(f"报告已生成: {output_file}")

# 使用
generate_monthly_report('sales_data.csv', './reports')
```

### 数据清洗脚本

```python
import pandas as pd
import numpy as np

def clean_data(input_file, output_file):
    """数据清洗脚本"""
    # 读取数据
    df = pd.read_csv(input_file)
    
    print(f"原始数据: {len(df)} 行")
    
    # 删除重复行
    df = df.drop_duplicates()
    print(f"删除重复后: {len(df)} 行")
    
    # 处理缺失值
    for column in df.columns:
        if df[column].dtype in ['int64', 'float64']:
            df[column] = df[column].fillna(df[column].median())
        else:
            df[column] = df[column].fillna('未知')
    
    # 处理异常值
    for column in df.select_dtypes(include=[np.number]).columns:
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df = df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]
    
    print(f"清洗后: {len(df)} 行")
    
    # 保存清洗后的数据
    df.to_csv(output_file, index=False)
    print(f"数据已保存: {output_file}")

# 使用
clean_data('raw_data.csv', 'cleaned_data.csv')
```

## 定时任务

### 使用 schedule 库

```python
import schedule
import time
from datetime import datetime

def job():
    """定时任务"""
    print(f"任务执行时间: {datetime.now()}")

# 每天执行
schedule.every().day.at("09:00").do(job)

# 每小时执行
schedule.every().hour.do(job)

# 每周一执行
schedule.every().monday.do(job)

# 运行任务
while True:
    schedule.run_pending()
    time.sleep(1)
```

### 使用 Windows 任务计划程序

```python
# 创建批处理文件
def create_scheduled_task(script_path, task_name, schedule_time):
    """创建 Windows 定时任务"""
    batch_content = f"""
@echo off
python {script_path}
"""
    batch_file = f"{task_name}.bat"
    with open(batch_file, 'w') as f:
        f.write(batch_content)
    
    # 创建任务计划程序命令
    cmd = f'schtasks /create /tn "{task_name}" /tr "{batch_file}" /sc daily /st {schedule_time}'
    os.system(cmd)
    print(f"定时任务已创建: {task_name}")

# 使用
create_scheduled_task('cleanup.py', 'DailyCleanup', '02:00')
```

## 项目结构

```
automation_project/
├── file_processing/
│   ├── batch_rename.py
│   ├── batch_convert.py
│   └── file_organizer.py
├── web_scraping/
│   ├── news_scraper.py
│   ├── price_monitor.py
│   └── data_extractor.py
├── data_processing/
│   ├── report_generator.py
│   ├── data_cleaner.py
│   └── excel_processor.py
├── scheduling/
│   ├── scheduler.py
│   └── tasks/
│       ├── daily_cleanup.py
│       └── weekly_report.py
└── config/
    └── settings.py
```

## 实战示例

```python
# 文件整理脚本
import os
from pathlib import Path
from datetime import datetime

def organize_files(directory):
    """按文件类型整理文件"""
    path = Path(directory)
    
    # 定义文件类型映射
    type_mapping = {
        'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
        'Documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx'],
        'Videos': ['.mp4', '.avi', '.mov', '.mkv'],
        'Audio': ['.mp3', '.wav', '.flac', '.aac'],
        'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz']
    }
    
    # 创建分类目录
    for folder in type_mapping.keys():
        (path / folder).mkdir(exist_ok=True)
    
    # 移动文件
    for file in path.iterdir():
        if file.is_file():
            for folder, extensions in type_mapping.items():
                if file.suffix.lower() in extensions:
                    destination = path / folder / file.name
                    file.rename(destination)
                    print(f"移动: {file.name} -> {folder}/")
                    break

# 使用
organize_files('./downloads')
```
