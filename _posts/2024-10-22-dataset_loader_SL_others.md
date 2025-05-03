---
title: 【pytorch笔记/土堆pytorch完结】Dataset, Dataloader, model S&L, others
date: 2024-10-22 10:00:00 +0800
categories: [deep learning, pytorch]
tags: [deep learning, python, pytorch]     # TAG names should always be lowercase
description: Dataset, Dataloader, model S&L, others
---

## 前言

- 使用教程来自[小土堆pytorch教程](https://www.bilibili.com/video/BV1hE411t7RN)
- 配置环境：torch2.0.1+cu118与对应torchaudio和torchvision

## 目标

- 简单记录 dataset 和 dataloader 用法
- 简单记录 model 的 S&L 方法
- 杂项

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
from torch.utils.data import Dataset

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

- 当传参使用 mydata[index] -> mydata._getitem_(index)

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
```

## 杂项

### 获取`acc`与`f1 score`

```python
target = torch.tensor([[0.1,  0.2],
                       [0.05, 0.4]])

pred_row = target.argmax(1) # 按行为顺序比较
# tensor([1, 1])
pred_col = target.argmax(0) # 按列为顺序比较
# tensor([0, 1])

output = torch.tensor([0, 1])

print(output == pred_row)
# tensor([False,  True])
print(output == pred_col)
# tensor([True, True])
```

- 一些我当时训练`Resnet50`的时候写的：

```python
correct_num = (predicted == labels).sum().item() # sum求和 item转换成数
correct = correct + correct_num

accuracy = correct / total
f1 = f1_score(all_labels, all_preds, average='weighted')  # 使用加权平均
```

### 调整训练与评估模式
```python
model.train()
model.eval()
```

### 利用GPU训练

- 可以使用`.cuda()`：model、`loss`类、在训练/评估中，使用dataloader后的样本和标签可以用`.cuda()`（虽然不会直接显示可以用）
- 不能使用`.cuda()`：dataset（继承了`Dataset`类）、optimizer


- 第一种办法

```python
if torch.cuda.is_available():
    model = model.cuda() # 第一种
```

- 第二种办法

```python
device = torch.device("cpu")

# 默认 cuda:0
# 也可以设定为 cuda:1 ...
device = torch.device('cuda' if torch.cuda.is_available() else "cpu")

model = torchvision.models.resnet50()
model.to(device)
```

> 妙用`torch.cuda.is_available()`
{: .prompt-info }

- 可以使用`time`库来检查花了多少时间
```python
import time
st_time = time.time()
en_time = time.time()
cost_time = en_time - st_time
```

### 模型验证套路

```python
# 假设现在有一个模型 model
model.eval()

with torch.no_grad(): # 评估的时候就不用更新梯度了
    for imgs, label in dataloader:
        # ....
        # ....
```