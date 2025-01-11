---
title: 跑 baseline 用
date: 2025-01-11 10:00:00 +0800
categories: [baseline]
tags: [python, baseline]     # TAG names should always be lowercase
description: 跑 baseline 用
---

## NER 系列

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