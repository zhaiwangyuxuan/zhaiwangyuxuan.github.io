---
title: Deep Dive into LLMs like ChatGPT
date: 2025-07-02 10:00:00 +0800
categories: [LLM/MLLM, Andrej_Karpathy]
tags: [llm/mllm]     # TAG names should always be lowercase
description: Andrej Karpathyx
---

- [课程链接](https://www.youtube.com/watch?v=7xTGNNLPyMI)

## Pretraining

### Pretraining data (Internet)

- [Fineweb 大规模英文数据集](https://huggingface.co/datasets/HuggingFaceFW/fineweb)

- ![数据集收集过程](assets/post_img/2025-07-02-Karpathy_Deep_Dive_into_LLMs_like_ChatGPT/2025-07-02-Karpathy_Deep_Dive_into_LLMs_like_ChatGPT_01.png)

### Tokenization

- 每个字母可以由一个 8 位二进制数表示，我们可以用 0 - 255 来表示，可以缩短整体长度；

- 进一步地，我们可以采取 The Bite pair coding algorithm：将常见的 consecutive symbol 组合起来，形成一个新的 symbol；

    - 例如；116 后接 32，在预训练文本中很常见，就可以把 116 与 32 组合起来当作一个新符合 256；

    - GPT4 用了 100,277 个 symbol（or TOKEN）；

- [一个以 GPT4 tokenizer 为基础的网站](https://tiktokenizer.vercel.app/?model=cl100k_base) - 这是 case sensitive （区分大小写）的；

- **这些代表的 text chunks 像是句子的原子，数字只是一个 ID，没有实际意义**。

### Neural network I/O

- 输入一段 token window，NN 给出下一个 token 的 probability；

- [一个大模型结构可视化的网站 bbycroft.net](https://bbycroft.net/llm)

- inference：to generate data, just predict one token at a time

### GPT-2: training and inference

- GPT-2 was published by OpenAl in 2019

- [Paper: Language Models are Unsupervised Multitask Leaarners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)

- Transformer neural network with:
    
    - 1.6 billion parameters
    
    - maximum context length of 1024 tokens
    
    - trained on about 100 billion tokens

- [复现 GPT-2](https://github.com/karpathy/llm.c/discussions/677)

- [Karpathy 使用的云显卡服务商 lambda.ai](https://lambda.ai/)

### Llama 3.1 base model inference

- 预训练太费钱了，所以我们直接用大企业做好的 base model

- [gpt2 base model](https://openai.com/index/gpt-2-1-5b-release/)

- [使用 hyperbolic 来使用 Llama 3.1 base model](https://app.hyperbolic.ai/models/llama31-405b-base-bf-16)

- It is a token-level internet document simulator

- It is stochastic / probabilistic - you're going to get something else each time you run

- It "dreams" internet documents

- It can also recite some training documents verbatim frommemory ("regurgitation")

- The parameters of the model are kind of like a lossy zip file othe internet => a lot of useful world knowledge is stored in the parametersof the network

## pretraining to post-training (supervised learning)

- 以上这些预训练的部分，产出了 base model

- 接下来我们要整 post-training

### post-training data (conversations)

- 比预训练便宜，但有效

- 使用对话的形式来告诉大模型什么是好的。

- [OpenAI 的讲微调的论文 - InstructGPT：Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)

- 一个大量使用合成问答对的模型：[UltraChat](https://github.com/thunlp/UltraChat/blob/main/README.md)

### hallucinations, tool use, knowledge/working memory

- Hallucination 大模型幻觉：本身就是基于统计学的

- [meta 如何应对 hallucination：论文](https://arxiv.org/abs/2407.21783)

- Tool use: 让大模型面对不明问题的答案时，自己去搜索

- knowledge/working memory：

    - !!! "Vague recollection" vs. "Working memory" !!!

    - Knowledge in the parameters == Vague recollection (e.g. off something you read 1 month ago)
    
    - Knowledge in the tokens of the context window == Working memory

### knowledge of self

- 存在一个 system prompt

### models need tokens to think

- 比较：以下哪个做题过程好？

    - Assistant: "**The answer is $3.** This is because 2 oranges at $2 are $4 total. So the 3 apples cost $9, and therefore each apple is 9/3 = $3".

    - Assistant: "The total cost of the oranges is $4. 13 - 4 = 9, the cost of the 3 apples is $9. 9/3 = 3, so each apple costs $3. **The answer is $3**".

    - 后者更好，因为它真正经历了计算过程才得出了最终结果。而前者先生成了答案，大模型并不是真正计算了这个结果。

    - 后者展现了计算过程，适合大模型去学习。

- 如果在提示词中，不让大模型使用思考 token，而是直接输出答案，那么大模型错误概率会大幅提升。

- Karpathy 更喜欢让大模型用工具，而不是仅仅依靠大模型。大模型并不擅长计数（counting）。

### tokenization revisited: models struggle with spelling

- 大模型眼中只有 token，跟人类视角完全不同。人类可以一个字母一个字母地来看一个单词，但大模型只会看作一整个 token。因此，大模型在面对 spelling 的任务时，无法保证高准确率。例如输出某个单词的前 x 个字母；还有经典 strawberry 数 r 任务

### jagged intelligence

- 大模型可以解决 phd 级别的问题，但大模型却会在简单问题上翻车；例如 9.9 与 9.11 的比较。

## supervised finetuning to reinforcement learning

- 从有监督微调到强化学习

### reinforcement learning

- 模型进行若干轮测试，选取其中足够好的轮数，不断重复训练；

- 目前 RL 还没有像 SFT 一样固定下来的范式；

### DeepSeek-R1

- [R1 技术报告](https://arxiv.org/abs/2501.12948)

- [together.ai - Karpathy 用的大模型网站](https://www.together.ai/)

- [Google AI studio](https://aistudio.google.com/prompts/new_chat)

### AlphaGo

- [震惊世界的第 37 手](https://www.youtube.com/watch?v=HT-UZkiOLv8)

### reinforcement learning from human feedback (RLHF)

- 在 verified domain, STF / RL 有效，也可以用 LLM-judge；

- 但在 unverified domain，例如写作领域，没有标准；可以人工评分找好的；但是费时费力；

    - 不妨用 RLHF，[论文](https://arxiv.org/abs/1909.08593)

- Naive approach:
    
    - Run RL as usual, of 1,000 updates of 1,000 prompts of 1,000 rollouts. (cost: 1,000,000,000 scores from humans)

- RLHF approach（训练奖励模型来模拟人类评分）:

    - STEP 1: Take 1,000 prompts, get 5 rollouts, order them from best toworst (cost: 5,000 scores from humans)

    - STEP 2: Train a neural net simulator of human preferences ("rewaard model")

    - STEP 3: Run RL as usual, but using the simulator instead of actualhumans

- RL 也有缺点：为了最大化奖励，模型可能会采取一些不符合规则的“诡计”。

- reward model is gameable.

## other things

### preview of things to come

- multimodal (not just text but audio, images, video, natural conversation)

- pervasive, invisible

- tasks -> agents (long, coherent, error-correcting contexts)

- pervasive, invisible, computer-using

- test-time training?, etc.

### where to find LLMs

- reference https://lmarena.ai/

- subscribe to https://buttondown.com/ainews

- X/Twitter

- Proprietary models: on the respective websites of the LLMproviders

- Open weights models (DeepSeek, Llama): an inference provider, e.g. TogetherAI

- Run them locally! LMStudio