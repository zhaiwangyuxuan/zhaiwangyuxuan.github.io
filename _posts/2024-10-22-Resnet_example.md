---
title: 【pytorch笔记】Resnet 复现实例
date: 2024-10-22 11:00:00 +0800
categories: [deep learning, pytorch]
tags: [deep learning, python, pytorch]     # TAG names should always be lowercase
description: Resnet 复现实例
---

## 前言

- 使用教程来自[小土堆pytorch教程](https://www.bilibili.com/video/BV1hE411t7RN)
- 配置环境：torch2.0.1+cu118与对应torchaudio和torchvision

## 之前复现某篇论文用的代码

### 读取数据代码

```python
from torch.utils.data import Dataset
import os
from PIL import Image

# 定义
class myData(Dataset):
    
    def __init__(self, root_dir_path, img_dir_path, label_dir_path, transform, label_transform):
        '''
        Args:
            label_dir_path: 根目录 图片与标签的上级文件夹路径
            img_dir_path: 存储了图片的文件夹的路径
            label_dir_path: 存储了标签的文件夹路径
            transform: 应用何种变换
            label_transform: 标签应用何种变换
        '''
        # 定义标签映射
        # 必须映射!
        # self.label_mapping = {
        #     'very quiet': 0,
        #     'quiet': 1,
        #     'noisy': 2,
        #     'very noisy': 3,
        # }

        # 存储了根目录 图片的文件夹的路径 与 标签的excel文件路径
        self.root_dir_path = root_dir_path
        self.img_dir_path = img_dir_path
        self.label_dir_path = label_dir_path
    
        # 存储了图片名字的列表
        self.img_name_list = os.listdir(os.path.join(self.root_dir_path, self.img_dir_path))

        # 存储了图片标签的列表 索引与名字列表一一对应
        self.img_label_list = []
        for img_name in self.img_name_list:
            img_label_path = os.path.join(self.root_dir_path, self.label_dir_path, img_name + '.txt')
            label = None
            with open(img_label_path, 'r') as f:
                label = f.read().strip()

            #mapping_label = self.label_mapping.get(label)
            label = int(label)
            self.img_label_list.append(label)

        # transform
        self.transform = transform
        self.label_transform = label_transform

    def __getitem__(self, index):
        # 读取图片
        img_name = self.img_name_list[index]
        img_path = os.path.join(self.root_dir_path, self.img_dir_path, img_name)
        img = Image.open(img_path)

        label = self.img_label_list[index]

        if self.transform is not None:
            img = self.transform(img)
        
        if self.label_transform is not None:
            label = self.label_transform(label)

        # 返回图片与标签
        return img, label
    
    def __len__(self):
        return len(self.img_name_list)
    
```

### 训练代码

```python
# encoding: utf-8
import torch
import torchvision
from torch import nn, optim
# from torch.utils.data import Dataset
from torch.utils.data import DataLoader
# from PIL import Image
from torchvision import transforms
from sklearn.metrics import accuracy_score, precision_score
# import os 
from mydata_definition import myData

# -------------- 及时调整超参数 -------------- #
myBatch_size = 16
myEpochs = 30
myNum_workers = 0
myLr = 0.0001

# -------------- 及时修改训练与测试的文件路径 -------------- #
root_dir = "/"
train_img_dir = "train"
train_label_dir = "train_label"
model_save_path = f"resnet50_{myBatch_size}_{myEpochs}_{myNum_workers}_{myLr}.pth"


# 确定设备
myDevice = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 定义更新
myTransform = transforms.Compose([
    transforms.Resize((224, 224)),  # 调整到224*224 ResNet 专用
    transforms.ToTensor()  # 转换为张量
])

train_set = myData(root_dir, train_img_dir, train_label_dir, 
                   transform=myTransform, 
                   label_transform=None)

train_loader = DataLoader(dataset=train_set, batch_size=myBatch_size, 
                          shuffle=False, num_workers=myNum_workers, 
                          drop_last=False)

# 载入 resnet50 模型
resnet50 = torchvision.models.resnet50(weights=None)
resnet50 = nn.DataParallel(resnet50).to(device=myDevice)

# 修改最后的线性层 输出为4个特征
num_ftrs = resnet50.module.fc.in_features
resnet50.module.fc = nn.Linear(num_ftrs, 4).to(myDevice) # !!!!!!!!!!!!!!!!!!!!!! 这里 修改最后一层的输出类别!!!!!!!!!!!!!

# # 由于训练数据较小 所以只训练 softmax 层
# for param in resnet50.parameters():
#     param.requires_grad = False

# # 允许fc层的权重和偏置更新
# for param in resnet50.module.fc.parameters():
#     param.requires_grad = True

# 定义损失函数和优化器
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(resnet50.parameters(), lr=myLr)  # 只优化最后一层

# 调整为训练状态
resnet50.train()

print("------------ 开始训练啦 ------------")
print(f"共有{len(train_set)}条训练数据")
# 开始训练
num_epochs = myEpochs
for epoch in range(num_epochs):
    running_loss = 0.0  # 用于累计损失
    for inputs, labels in train_loader:
        inputs, labels = inputs.to(myDevice), labels.to(myDevice)
        optimizer.zero_grad()
        outputs = resnet50(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()  # 累加损失

    epoch_loss = running_loss / len(train_loader)
    print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {epoch_loss:.4f}')

print("------------ 训练结束 ------------")

print("------------ 开始保存 ------------")
torch.save(resnet50, model_save_path)
print("------------ 保存结束 ------------")
```

### 测试代码

```python
# encoding: utf-8
import torch
import torchvision
from torch import nn, optim
# from torch.utils.data import Dataset
from torch.utils.data import DataLoader
# from PIL import Image
from torchvision import transforms
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
# import os 
from mydata_definition import myData

# -------------- 及时调整超参数 -------------- #
myBatch_size = 16
myEpochs = 30
myNum_workers = 0
myLr = 0.0001

# -------------- 及时修改训练与测试的文件路径 -------------- #
root_dir = "/"
test_img_dir = "test"
test_label_dir = "test_label"
model_save_path = f"/resnet50_{myBatch_size}_{myEpochs}_{myNum_workers}_{myLr}.pth"

print(f"使用模型路径为{model_save_path}")

# 确定设备
myDevice = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 定义更新
myTransform = transforms.Compose([
    transforms.Resize((224, 224)),  # 调整到224*224 ResNet 专用
    transforms.ToTensor()  # 转换为张量
])

test_set = myData(root_dir, test_img_dir, test_label_dir, 
                  transform=myTransform, 
                  label_transform=None)

test_loader = DataLoader(dataset=test_set, batch_size=myBatch_size, 
                         shuffle=False, num_workers=myNum_workers, 
                         drop_last=False)


# 载入我们训练好的 resnet50 模型
load_model = model_save_path
resnet50 = torch.load(load_model)
resnet50 = resnet50.to(myDevice)

# 调整为测试状态
resnet50.eval()

# 进行测试
total = 0
correct = 0
all_labels = []
all_preds = []

print("------------ 开始测试 ------------")
print(f"共有{len(test_set)}条测试数据")
with torch.no_grad():  # 测试时不需要计算梯度
    for inputs, labels in test_loader:
        inputs, labels = inputs.to(myDevice), labels.to(myDevice)
        outputs = resnet50(inputs)
        _, predicted = torch.max(outputs.data, 1)

        total += labels.size(0)
        correct_num = (predicted == labels).sum().item()
        correct = correct + correct_num

        all_labels.extend(labels.cpu().numpy())
        all_preds.extend(predicted.cpu().numpy())

accuracy = accuracy_score(all_labels, all_preds)
precision = precision_score(all_labels, all_preds, average="weighted", zero_division=0)
recall = recall_score(all_labels, all_preds, average="weighted", zero_division=0)
f1 = (2 * precision * recall) / (precision + recall)

print(f"ResNet50 测试准确率为：{accuracy}")
print(f"ResNet50 测试精确率为：{precision}")
print(f"ResNet50 测试召回率为：{recall}")
print(f"ResNet50 测试 F1 值为：{f1}")

# # watch -n 1 nvidia-smi
# gpustat -i
```