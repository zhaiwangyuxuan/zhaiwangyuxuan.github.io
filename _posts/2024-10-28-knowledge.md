---
title: 【学术】个人知识库
date: 2024-10-28 00:10:00 +0800
categories: [academic, tools]
tags: [academic tools]     # TAG names should always be lowercase
description: 【学术】个人知识库
pin: true
---

## anaconda3 用

- 创建与移除环境（包括移除下载的库）

```bash
conda create -n env_name python=X.X（python版本号）

conda remove -n ENV_NAME --all
```

- 添加清华镜像源

```bash
1.查看anaconda中已经存在的镜像源

conda config --show channels

2.添加镜像源(永久添加)

conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/

3.设置搜索时显示通道地址

conda config --set show_channel_urls yes
```

- 磁盘空间不够

```bash
TMPDIR=xxxxx pip install -r requirements.txt --no-cache-dir

# xxxx 为临时路径 不需要带引号
```

- 安装gpu版本的pytorch

   1. [官网下载](https://pytorch.org/get-started/previous-versions/)

   2. 找CUDA匹配版本

   3. `conda activate`激活环境后，先尝试用 Conda 下的方式下载
   
   4. 不行的话就用 wheel 下的方式下载

- 无匹配版本
 
   1. 处理：Python 版本不对

```bash
ERROR: Could not find a version that satisfies the requirement
```

## GitHub Desktop GPG

```bash
gpg --list-secret-keys --keyid-format LONG
git config --global user.signingkey <GPG_KEY_ID>
git config --global commit.gpgsign true
```

## screen 关电脑服务器继续跑

```bash
创建：screen -S xxx

查看有多少会话：screen -ls

恢复：screen -r xxx.xxx

如果不能恢复：先screen -d xxx.xxx

再screen -r xxx.xxx

删除 screen -S xxx.xxx -X quit

完成以上步骤，使用ctrl+a+d退出screen，然后再×掉cmd窗口就可以

Detached意思是当前screen没有被打开，相对的是Attached表示当前screen正处在打开状态。
```

## 增加github克隆成功概率

- 用 ghproxy 代理进行 git clone

- 重点在于，在原本要克隆的网站地址前加入 `https://mirror.ghproxy.com/`

```bash
git clone https://mirror.ghproxy.com/https://github.com/........
```

## huggingface 

[镜像链接](https://hf-mirror.com/)

- 修改缓存路径

```bash
vim ~/.bashrc

# 在末尾行加入
export HF_HOME="/path/to/you/dir"  # 替换为你想更改的目标路径

# 立即生效
source ~/.bashrc

# 查看是否生效
env | grep HF_HOME
```

## vscode ssh 出错与修改 .vscode-server/ 存储位置

```bash
rm -rf .vscode-server/
```

- [修改路径](https://blog.csdn.net/weixin_43301333/article/details/128503260)

## NER 模型学习参考

- [命名实体识别学习记录（spaCy/OpenNLP..）](https://blog.csdn.net/m0_53632564/article/details/128622529)

- 加速 Stanford NER

```python
sentence = conversation[i][0]['value']      
text = sentence

sentences = text
tokenized_sentences = [nltk.word_tokenize(sentence) for sentence in nltk.sent_tokenize(sentences)]

# tag sentences
ne_annotated_sentences = sn.tag_sents(tokenized_sentences)  
```

### Stanford NER

```bash
pip install stanza
```

```python
import stanza

nlp = stanza.Pipeline(lang='en', processors='tokenize,ner')
doc = nlp("Chris Manning teaches at Stanford University. He lives in the Bay Area.")
print(*[f'entity: {ent.text}\ttype: {ent.type}' for ent in doc.ents], sep='\n')
```

- 克服网络问题

- 参考[该链接](https://blog.csdn.net/gz927cool/article/details/121868829)

1. json 文件前往 [此链接](https://github.com/stanfordnlp/stanza-resources) 下载
2. 模型 文件前往 [此链接](https://huggingface.co/stanfordnlp/stanza-en) 下载

## 微调大模型

- [用抱抱脸transformers微调ViT](https://huggingface.co/blog/fine-tune-vit)

## GPU 显存不够 与 指定显卡

**环境设置要放在最最最最最最前面！！！！！！！！也就是第一二行的位置！！！！**

```python
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "7"
```

## 一些书写注意

The mathematics powered by [**MathJax**](https://www.mathjax.org/):

$$
\begin{equation}
  \sum_{n=1}^\infty 1/n^2 = \frac{\pi^2}{6}
  \label{eq:series}
\end{equation}
$$

We can reference the equation as \eqref{eq:series}.

When $a \ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are

$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

> An example showing the `tip` type prompt.
{: .prompt-tip }

> An example showing the `info` type prompt.
{: .prompt-info }

> An example showing the `warning` type prompt.
{: .prompt-warning }

> An example showing the `danger` type prompt.
{: .prompt-danger }