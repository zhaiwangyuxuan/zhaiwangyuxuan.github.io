---
title: 【大模型】huggingface_transformers
date: 2024-11-08 10:00:00 +0800
categories: [LLM/MLLM, huggingface]
tags: [LLM/MLLM, huggingface]     # TAG names should always be lowercase
description: transformers
---

*发现如果按照之前pytorch那么写笔记的话，要写好几条，这次我干脆就整合成一条了*

## Pipeline

### 是什么？

- 将数据预处理、模型调用、结果后处理三部分组装成的流水线，使我们能够直接输入文本便能获得最终的答案

![参考图片](assets/post_img/2024-11-08-huggingface_transformers/2024-11-08-huggingface_transformers_01.png)

### 背后做了什么？

1. 初始化`Tokenizer`
2. 初始化`Model`
3. 数据预处理
4. 模型预测
5. 结果后处理

### 相关代码

```python
# 看一看支持什么任务
for k, v in SUPPORTED_TASKS.items():
    print(k, v["type"])

pipe = pipeline("text-classification") # 创建了一个类

# 检验结果
ans = pipe("yes!")
print(ans)

# 指定任务类型 指定使用模型 创建指定模型的Pipeline
# 前面为任务类型 后面model=为指定的模型
pipe = pipeline("text-classification", model="xxxxxxxxx")

# 预先加载模型 再加载Pipeline
model = AutoModelForSequenceClassification.from_pretrained("xxxxxx")
tokenizer = AutoTokenizer.from_pretrained("xxxxxxx")
pipe = pipeline("text-classification", model=model, tokenizer=tokenizer)

# 查看pipe用来运行的设备
print(pipe.model.device)

# 使用GPU来推理
# 调整device参数 012代表显卡序号
# Defines the device (e.g., "cpu", "cuda:1", "mps", or a GPU ordinal rank like 1) 
pipe = pipeline("text-classification", device=0)

# 通过`ctrl`点进类的具体说明 可以看到官方给的输入例子 也可以去说明文档搜索
a = AudioClassificationPipeline()
```

## Tokenizer

### Tokenizer 简介

- 数据预处理:

1. 分词：使用分词器对文本数据进行分词（字、字词）；
2. 构建词典：词典映射；
3. 数据转换：将文本序列转换为数字序列；
4. 数据填充与截断：以batch输入到模型中，对短数据填充，对长数据进行截断，保证数据长度符合模型能接受的范围，同时batch内的数据维度大小一致。

### 导入与加载

```python
# 导入
from transformers import AutoTokenizer

## 去huggingface上找名字
## 默认存储到 .cache/huggingface/hub/xxxx(模型)/snapshots/ 这里面是所有的文件
tokenizer = AutoTokenizer.from_pretrained("xxxxxxx") 

## 修改存储路径
tokenizer.save_pretrained("./abcd")

## 从本地加载tokenizer
tokenizer = AutoTokenizer.from_pretrained("./abcd") 

```

### 句子分词与查看词典

```python
sen = "扣1送原神至尊版"

# 句子分词
tokens = tokenizer.tokenize(sen)

# ======= ======= ======= ======= #
# 查看词典
tokenizer.vocab

## 有一些词语会比较奇怪 是因为要分成若干 “子词”

## 分词后的大小
tokenizer.vocab_size
```

### 索引转换

```python
## 转换成数字
ids = tokenizer.convert_tokens_to_ids(tokens)

## 转换回token序列
tokens = tokenizer.convert_ids_to_tokens(ids)

## 将token序列转换为string
str_sen = tokenizer.convert_tokens_to_string(tokens)

# 更便捷的实现方式
## 将字符串转换为id序列
ids = tokenizer.encode(sen)

# [101, ......, 102] 代表开始与结束 [CLS] [SEP]
# 可以通过 如下 来不填充101 102
ids = tokenizer.encode(sen, add_special_tokens=False)

## 将 id序列 转换为字符串
## 是否跳过特殊字符
str_sen = tokenizer.decode(ids, skip_special_tokens=False)
```

### 填充与截断

```python
## 填充
ids = tokenizer.encode(sen, padding="max_length", max_length=15)
# 会将不够的位置填充上0 注意 是在102后填充0

## 截断
ids = tokenizer.encode(sen, max_length=5, truncation=True)
# 是包括101 102在内的ids序列长度变成5 （实际留给原句子的只有3个长度）

# ======= ======= ======= ======= #
# 其他输入部分
ids = tokenizer.encode(sen, padding="max_length", max_length=15)

attention_mask = [1 if idx != 0 else 0 for idx in ids] # 有效为1 无效为0    
## [1, 1, ..., 0, ..., 0]

token_type_ids = [0] * len(ids)
## [0, 0, ..., 0, 0]
```

### 快速调用

```python
inputs = tokenizer.encode_plus(sen, padding="max_length", max_length=15) 
### 返回一个字典
### {'input_ids': [],
###  'token_type_ids': [],
###  'attention_mask': []}

## 也可以直接调用
inputs = tokenizer(sen, padding="max_lenth", max_length=15)
## 最终效果与 encode_plus 相同
```

### 处理batch数据

```python
sen = ["扣1送原神至尊版",
       "111大哥真送吗",
       "收到"]
res = tokenizer(sen, padding="max_length", max_length=15)

# 此处为jupyter notebook专用
''' %%time 可以计算一处单元格所用时间 '''

for i in range(1000):
    tokenizer(sen)

# 以batch的方法 比上面快!!!!!!!!
res = tokenizer([sen] * 1000)  
```

### fast / slow 与 特殊Tokenizer

- fast用rust实现 slow用python实现

```python
slow_tokenizer = AutoTokenizer.from_pretrained("xxxxx", use_fast=False)
print(slow_tokenizer)
# 可以看到后面没有 'fast' 了

# 注：fast专属
inputs = tokenizer(sen, return_offsets_mapping=True)
# 多返回一个 'offset_mapping' 记录一个分词的开始位置与结束位置

# 注：fast专属
inputs.word_ids()
# [None, 0, 1, 2, ..., 7, 7, 8, None] 可能会拆成子词 意为原始数据中的第几个
# 听这个最好先了解一下分词算法BPE和SentencePiece

# ======= ======= ======= ======= #
# 特殊Tokenizer的实现
# 有一些非官方模型（比如自己上传的），是在远程仓库中实现的
# 所以必须
tokenizer = AutoTokenizer.from_pretrained("./xxxx", trust_remote_code=True)
# 就算是本地加载也要trust_remote_code=True
```

## 基础组件之 Model

### 原理概述

- `Transformer`

    - 为编码器 Encoder 与解码器 Decoder 模型；
    - 形成的 Transformer Block 不断堆叠，由注意力机制 Attention 与 FFN 组成
    - 注意力机制是核心特征；

- `Attention 注意力机制`

    - 可以有选择性的告诉模型要使用哪些上下文

    ![参考图片](assets/post_img/2024-11-08-huggingface_transformers/2024-11-08-huggingface_transformers_02.png)

- `Model Head`

    - 连接在模型后的层，通常为 1 个或多个全连接层
    - 将模型的编码结果进行映射，以解决不同类型的任务

### 导入与加载

- 通常来讲，我们无法正常下载模型，所以我们需要借助镜像网站下载，并加载本地模型；

- 我参考我自己之前写的 [在这里！](https://zhaiwangyuxuan.github.io/posts/knowledge/)

```python
# 导入
from transformers import AutoConfig, AutoModel, AutoTokenizer 

# 1. 你的网很好，想下载 Qwen/Qwen2.5-0.5B-Instruct 可以直接
model = AutoModel.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")

# 2. 无法下载，请使用加载本地模型的办法
model_path = "xxx"
model = AutoModel.from_pretrained(model_path)
```

### 模型参数

- *model_args, **kwargs 点进原函数查看就行

```python
# 体现模型本身的参数
print(model.config)

# 体现模型运行中 / 额外的可以设置的参数
config = AutoConfig.from_pretrained(model_path)
print(config)

# 注意到
'''
  "architectures": [
    "Qwen2ForCausalLM"
  ],
'''

# 可以导入 并查看 模型的结构
from transformers import Qwen2ForCausalLM
```

## 基础组件之 Datasets

### 简介

- 一个简单易用的数据集加载库，可从本地或者 Huggingface hub 中获取数据集