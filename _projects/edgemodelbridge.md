---
title: EdgeModelBridge 大小模型协同引擎
title_en: EdgeModelBridge – Large-Small Model Co-Inference Engine
date: 2025-09-01
status: active
summary_zh: 云-边-端三级协同推理引擎，实现大模型与小模型之间的动态路由、在线蒸馏与联邦训练，支持多设备流水线并行与端侧低成本部署。
summary_en: A cloud-edge-device co-inference engine enabling dynamic routing, online distillation, and federated training between large and small models, with multi-device pipeline parallelism and on-device deployment.
themes:
  - 边缘智能
cover: /assets/images/placeholders/card-16x9.svg
code: https://github.com/EdgeAI-2000
metrics:
  collaboration: "云 · 边 · 端三级协同"
  techniques: "蒸馏 · 量化 · Speculative Decoding"
  training: "联邦学习 · 流水线并行"
highlights:
  - 成本感知动态路由（精度 × 延迟 × 算力）
  - 训练到部署一体化工具链（剪枝/量化/蒸馏）
  - 端云分段推理与早退（Early Exit）
  - 质量回归与性能/能耗监控
---

EdgeModelBridge 是实验室构建的**大小模型协同引擎**，聚焦云-边-端三级架构下的推理效率与智能分工。

**核心模块：**

- **路由策略**：成本感知的大/小模型动态路由（精度 × 时延 × 算力联合优化）
- **蒸馏与量化**：从大模型训练到边缘端部署的自动化工具链
- **端云协同**：分段推理、KV Cache 复用、Speculative Decoding 加速
- **联邦训练**：跨异构设备的隐私保护协同训练

**落地能力：** 在算力受限的边缘设备上实现接近大模型的推理质量，同时控制端侧功耗与响应延迟。
