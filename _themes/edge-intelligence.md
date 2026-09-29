---
title: 边缘大模型推理与部署
title_en: Edge LLM Inference and Deployment
intro: 面向资源受限的边缘设备，联合优化模型部署、请求路由与执行调度，通过端侧量化推理、跨节点模型分片和大小模型协作，平衡延迟、吞吐、内存、能耗与输出质量。
intro_en: Resource-aware model placement, request routing, and execution scheduling combine on-device inference, collaborative model sharding, and small–large model collaboration to balance latency, throughput, memory, energy, and quality.
keywords:
  - edge LLM inference
  - resource-aware scheduling
  - model sharding
  - speculative decoding
cover: /assets/images/research/edge-llm-inference.png
order: 2
layout: theme
content_en: |
  ## Research Overview

  We study **edge LLM inference and deployment** under limited and changing compute, memory, energy, and network resources. Resource-aware model placement, request routing, and execution scheduling select among on-device execution, collaborative edge inference, and small–large model collaboration, with runtime feedback adapting these decisions.

  ### 2.1 On-Device Inference and Memory Optimization

  Model quantization and hardware adaptation enable deployment on mobile and embedded devices. KV cache management reduces memory overhead while inference optimization targets response latency and energy consumption.

  **Key techniques:** Model quantization · KV cache management · Hardware adaptation · On-device inference optimization

  ### 2.2 Model Sharding and Collaborative Edge Inference

  Consecutive model shards run across heterogeneous edge nodes, exchanging intermediate activations and using pipeline schedules. Device selection, model partitioning, and execution order are optimized jointly.

  **Key techniques:** Adaptive model sharding · Activation transfer · Pipeline parallelism · Heterogeneous resource scheduling

  ### 2.3 Small–Large Model Collaboration and Adaptive Orchestration

  An edge-resident small model drafts candidate tokens for a larger model on a more powerful node to verify and correct. Resource monitoring, dynamic request routing, and optional cloud resources improve inference efficiency subject to output-quality requirements.

  **Key techniques:** Speculative decoding · Dynamic model routing · Model placement optimization · Runtime feedback
---

## 研究方向概述

本方向聚焦**边缘大模型推理与部署**，面向算力、内存、能耗与网络条件受限且动态变化的环境，研究资源感知的模型部署、请求路由与执行调度。根据任务需求选择端侧执行、边缘协同或大小模型协作，并通过运行时反馈持续调整策略。

### 2.1 端侧量化推理与内存优化

通过模型量化与硬件适配，将大模型部署到移动终端和嵌入式设备，结合 KV 缓存管理降低内存开销，优化端侧响应延迟与能耗。

**关键技术：** 模型量化 · KV 缓存管理 · 硬件适配 · 端侧推理优化

### 2.2 跨节点模型分片与协同推理

将模型的连续分片部署到异构边缘节点，通过中间激活传输与流水线调度协同完成推理，联合优化设备选择、模型划分与执行顺序。

**关键技术：** 自适应模型分片 · 激活传输 · 流水线并行 · 异构资源调度

### 2.3 大小模型协作与自适应编排

利用边缘小模型生成候选 token，由高算力节点上的大模型验证与修正；结合资源监控、动态请求路由和可选云端资源，在输出质量约束下优化推理效率。

**关键技术：** 投机解码 · 动态模型路由 · 模型部署优化 · 运行时反馈
