---
title: 【pytorch笔记】损失函数与反向传播
date: 2024-10-19 15:00:00 +0800
categories: [deep learning, pytorch]
tags: [deep learning, python, pytorch]     # TAG names should always be lowercase
description: 损失函数与反向传播
---

## 前言

- 使用教程来自[小土堆pytorch教程](https://www.bilibili.com/video/BV1hE411t7RN)
- 配置环境：torch2.0.1+cu118与对应torchaudio和torchvision

## 目标

- 了解如何用`loss`计算输出与目标之间的差距
- 了解如何用`loss`为更新输出提供一定的依据，即应用于`backward`反向传播上

## L1loss

- 相减后得到损失值

![参考图片](assets/post_img/2024-10-19-loss_backward_01.png)

```python
input = torch.tensor([1, 2, 5], dtype=torch.float32)
target = torch.tensor([1, 2, 3], dtype=torch.float32)
l1loss = nn.L1Loss() # 默认是"mean"模式
loss_1 = l1loss(input, target)
print(loss_1) # tensor(0.6667)
```

## MSEloss

- Mean Squared Error 均方误差

![参考图片](assets/post_img/2024-10-19-loss_backward_02.png)

```python
MSEloss = nn.MSELoss() # 默认是"mean"模式
loss_MSE = MSEloss(input, target)
print(loss_MSE) # tensor(1.3333)
```

## CrossEntropyLoss - 交叉熵误差

- 具体解释借用该[知乎文章](https://zhuanlan.zhihu.com/p/35709485)
- 交叉熵损失主要应用与分类问题上，越小越好（别过拟合）

- 拓展之前写的[练手代码](https://zhaiwangyuxuan.github.io/posts/nn_prac/)，使用`CIFAR10`数据集

```python
dataset = torchvision.datasets.CIFAR10("tmp-tudui/CIFAR10", train=False,
                                       transform=torchvision.transforms.ToTensor(),
                                       download=False)

dataloader = DataLoader(dataset, batch_size=32)

class toy_model(nn.Module):

    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 32, 5, padding=2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 32, 5, padding=2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 5, padding=2),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(1024, 64),
            nn.Linear(64, 10)
        )

    def forward(self, x):
        x = self.model(x)
        return x

model = toy_model() 
loss = nn.CrossEntropyLoss()
for data in dataloader:
    imgs, label = data
    output = model(imgs)
    res_loss = loss(output, label)
    res_loss.backward() # 应用给反向传播
    # 注意 是对得到的损失结果进行.backward()
    print(res_loss)
```

> 注意是给得到的损失结果应用反向传播 .backward()
{: .prompt-info }