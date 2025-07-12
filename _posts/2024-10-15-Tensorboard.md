---
title: 【pytorch笔记】Tensorboard怎么用
date: 2024-10-15 20:00:00 +0800
categories: [deep learning, pytorch]
tags: [deep learning, python, pytorch]     # TAG names should always be lowercase
description: Tensorboard怎么用
---

## 前言
- 使用教程来自[小土堆pytorch教程](https://www.bilibili.com/video/BV1hE411t7RN)
- 配置环境：torch2.0.1+cu118与对应torchaudio和torchvision

- 作用：创建文件，并保存数据集到文件。利用这种方法可以在该训练循环过程中，将数据写入文件中，而不会延缓训练的速度

## 库与端口

### 引入库
```python
from torch.utils.tensorboard import SummaryWriter # 引入SummaryWriter这个类
```

### 查看转发端口
```bash
tensorboard --logdir=logs
```

### 修改端口
```bash
tensorboard --logdir=logs --port=6007
```

### 增加可以显示的图片
```bash
tensorboard --logdir=logs --samples_per_plugin=images=10000
```

## .add_scalar()
```python
from torch.utils.tensorboard import SummaryWriter # 这是一个类
writer = SummaryWriter("logs")

# 生成y = x 的函数图像
for i in range(100):
    writer.add_scalar("y = x", i, i)

writer.close()
```

### 如何使用上述代码？
1. vscode中先运行该段代码
2. 运行后，在终端输入 `tensorboard --logdir=logs`
3. 弹出提示，跳转到浏览器查看图像

### SummaryWriter()解释
```python
mySaveDir = "test/logs"
writer = SummaryWriter(log_dir=mySaveDir)
# 最常用的形式
# 输入参数默认为log_dir=
# 即生成的文件存储在哪个位置
# 其他参数随用随查
```

### .add_scalar()方法解释
```python
writer.addscalar()
# tag (str): 图表标题
# scalar_value (float or string/blobname): 函数图像y值
# global_step (int): 函数图像x值
# 其他参数随用随查
```

- 如果想要修改函数图像，必须先**运行修改后的代码**，再输入 `tensorboard --logdir=logs`
- 如果发现图像很混乱（即同时出现了多种函数图像），那么，去自己的设定的 log_dir 文件夹，删除里面的所有文件，再运行代码，终端输入 `tensorboard --logdir=logs` 即可

## .add_image()
```python
from torch.utils.tensorboard import SummaryWriter # 这是一个类
from PIL import Image
import numpy as np

writer = SummaryWriter(log_dir="logs")
pic_path = ["test1.jpg", "test2.jpg"]

for i in range(len(pic_path)):
    img_PIL = Image.open(pic_path[i])
    print(type(img_PIL))

    img_np = np.array(img_PIL) # 转成numpy.ndarray
    print(img_np.shape)

    writer.add_image("test", img_np, i + 1, dataformats="HWC")

writer.close()
```

### 引入PIL.Image与numpy的解释
1. 使用Image.open()引入图片，但注意到 .add_image() 接受的图片格式为(torch.Tensor, numpy.ndarray, or string/blobname) 但 Image.open() 办法获取的图片格式为 PIL.JpegImagePlugin.JpegImageFile 显然不匹配，**不能直接使用**该办法

2. 考虑使用 numpy.ndarray，通过 np.array() 转换，但依然报错。注意到 img_tensor: Default is :math:`(3, H, W)`。用 print(img_np.shape) 检查 输出 (512, 768, 3) 形状大差不差。又注意到 ``dataformats`` argument is passed, e.g. ``CHW``, ``HWC``, ``HW``。这其实是在说，在图片 shape 并非严格的 CHW 的情况下，**需要指定 dataformats 等于什么**

### .add_image()解释
```python
writer.add_image()
# tag (str):图像标题
# img_tensor (torch.Tensor, numpy.ndarray, or string/blobname): 输入图像数据
# global_step (int): 第几步
# dataformats (str): Image data format specification of the form: CHW, HWC, HW, WH, etc. 指定图片的通道数Channel、高度Height、宽度Width
```

### .add_audio()

```python
file1 = SummaryWriter("log_wav")
flag = 0

for data in mydata:
    waveform, sr, name = data
    file1.add_audio(tag = f"{name}", snd_tensor = waveform, sample_rate = sr)
    flag += 1
    if flag == 8:
        exit()

file1.close()
```