---
title: EdgeCoSense 协同感知平台
title_en: EdgeCoSense – Collaborative Perception Platform
date: 2025-09-01
status: active
summary_zh: 面向自动驾驶与无人机系统的多模态多视角协同感知平台，支持 Camera/LiDAR/Radar 数据同步标定、跨车/跨机协同推理与带宽自适应通信调度。
summary_en: A multimodal collaborative perception platform for autonomous driving and UAV systems, supporting Camera/LiDAR/Radar calibration, cross-vehicle/UAV co-inference, and bandwidth-adaptive scheduling.
themes:
  - 多模态协同感知
cover: /assets/images/placeholders/card-16x9.svg
code: https://github.com/EdgeAI-2000
metrics:
  scenarios: "V2V · V2I · UAV 编队"
  modalities: "Camera · LiDAR · Radar"
  features: "带宽自适应 · 误差补偿 · 实时可视化"
highlights:
  - 多传感器时间同步与外参标定
  - 分布式协同推理（融合/分割推理）
  - 鲁棒性增强（遮挡、传输丢包）
  - 延迟/带宽/精度三维评测看板
---

EdgeCoSense 是实验室面向**自动驾驶与无人系统**场景构建的协同感知平台，打通从数据采集、多模态标定到协同推理、通信调度的完整链路。

**核心模块：**

- **数据 & 标定**：多传感器时间同步、外参标定与数据管理
- **协同推理**：特征融合、分割推理与鲁棒性增强
- **通信调度**：带宽感知的信息选择与传输优先级策略
- **评测可视化**：延迟 / 带宽 / 精度 / 鲁棒性一体化评测看板

**典型场景：** 多车协同感知（V2V/V2I）、多无人机编队协同建图、语言指令驱动的 UAV 视觉导航（VLN）。
