---
title: 【pytorch笔记】Dataset, Dataloader, model S&L
date: 2024-10-21 10:00:00 +0800
categories: [deep learning, pytorch]
tags: [deep learning, python, pytorch]     # TAG names should always be lowercase
description: Dataset, Dataloader, model S&L
---

## 前言

- 使用教程来自[小土堆pytorch教程](https://www.bilibili.com/video/BV1hE411t7RN)
- 配置环境：torch2.0.1+cu118与对应torchaudio和torchvision

## 目标

- 简单记录 dataset 和 dataloader 用法
- 简单记录 model 的 S&L 方法

## Dataset 与下属类

### 使用现成的 Dataset

```python
dataset = torchvision.datasets.CIFAR10("tmp-tudui/CIFAR10", train=False,
                                       transform=torchvision.transforms.ToTensor(),
                                       download=False)
```
- root (string): 存储路径
- train (bool, optional): True 用训练集，False 用测试集
- transform (callable, optional): 输入一个 `function/transform`，让`PIL`格式的图片转换成transforms格式的图片 E.g, `transforms.ToTensor()`
- target_transform (callable, optional): 对`target`进行transforms转换
- download (bool, optional): 下载

### 使用自己的数据集

```python
class myData(Dataset):
    
    def __init__(self, ...):
        
        # 反正自己处理一下

    def __getitem__(self, index):
        
        # 自己处理一下 返回图片与标签
        return img, label
    
    def __len__(self):
        return len(self.img_name_list)


train_set = myData(root_dir, train_img_dir, train_label_dir, 
                   transform=myTransform, 
                   label_transform=None)
```

> 自定义的类必须继承`Dataset`类！
{: .prompt-info }

> 自定义类必须写`__init__`、`__getitem__`与`__len__`办法
{: .prompt-warning }

## DataLoader 类

```python
from torch.utils.data import DataLoader

train_loader = DataLoader(dataset=train_set, batch_size=myBatch_size, 
                          shuffle=False, num_workers=myNum_workers, 
                          drop_last=False)
```

- dataset (Dataset) – 一个继承了`Dataset`类的数据集

- batch_size (int, optional) – 一批多少量

- shuffle (bool, optional) – 每一轮打乱样本吗（默认`False`）

- num_workers (int, optional) – 用多少子进程（默认 0）

- drop_last (bool, optional) – 如果数据集不能被批次整除，要不要把余数的那些数据加入（默认`False`）

## 修改模型

- `vgg16`输出特征是1000，但`CIFAR10`数据集特征只有10个

```python
# 所以我们要修改vgg16的层
# 1. 不妨添加一个线性层 让1000特征变换成10特征
vgg16.classifier.add_module('add_linear', module=nn.Linear(1000, 10))

# 2. 不妨修改最后一个线性层 让原先的4096->1000变成4096->10
vgg16.classifier[6] = nn.linear(4096, 10)
```

## 模型的保存与载入

```python
# 保存方式1
# 模型结构 + 模型参数
torch.save(vgg16, "vgg16_save.pth")

# 载入方式1
vgg16_load = torch.load("vgg16_save.pth")

# 保存方式2
# 以字典的方式保存了网络中的一些参数 官方推荐
torch.save(vgg16.state_dict(), "vgg16_save.pth")

# 载入方式2
vgg16.load_state_dict(torch.load("vgg16_save.pth"))

# 自用
# .pth.tar数据载入
checkpoint = torch.load("resnet50_places365.pth.tar")
resnet50.load_state_dict(checkpoint['state_dict'])
````