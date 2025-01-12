---
title: 【学术】个人知识库
date: 2024-10-28 00:10:00 +0800
categories: [academic, tools]
tags: [academic tools]     # TAG names should always be lowercase
description: 【学术】个人知识库
pin: true
---

## GitHub Desktop GPG

```bash
gpg --list-secret-keys --keyid-format LONG
git config --global user.signingkey <GPG_KEY_ID>
git config --global commit.gpgsign true
```

## 增加github克隆成功概率

- 用 ghproxy 代理进行 git clone

- 重点在于，在原本要克隆的网站地址前加入 `https://mirror.ghproxy.com/`

```bash
git clone https://mirror.ghproxy.com/https://github.com/........
```

## huggingface 镜像

[链接](https://hf-mirror.com/)

## vscode ssh 出错

```bash
rm -rf .vscode-server/
```

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

## 微调大模型

- [用抱抱脸transformers微调ViT](https://huggingface.co/blog/fine-tune-vit)