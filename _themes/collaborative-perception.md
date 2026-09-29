---
title: 多智能体协同感知
title_en: Multi-Agent Collaborative Perception
intro: 面向车辆、路侧单元与无人机，研究异构特征对齐、任务驱动的高效通信与鲁棒融合，在遮挡、带宽受限和观测异步条件下支持三维检测、鸟瞰图建图与三维高斯重建。
intro_en: Multi-agent perception across vehicles, roadside units, and UAVs through heterogeneous alignment, task-aware communication, and robust fusion for 3D detection, BEV mapping, and 3D Gaussian reconstruction.
keywords:
  - multi-agent perception
  - heterogeneous alignment
  - task-aware communication
  - robust fusion
cover: /assets/images/research/multi-agent-collaborative-perception.png
order: 1
layout: theme
content_en: |
  ## Research Overview

  We study **multi-agent collaborative perception** across vehicles, roadside units, and UAVs, aiming for accurate, efficient, and robust scene understanding under occlusion, sensor heterogeneity, limited bandwidth, and asynchronous observations.

  ### 1.1 Heterogeneous Perception and Feature Alignment

  Local encoders extract features from cameras, LiDAR, and aerial observations. Features from different agents are aligned in a shared bird's-eye-view (BEV) space to support cross-modal and cross-view collaboration.

  **Key techniques:** Multimodal feature encoding · Heterogeneous alignment · Shared BEV representations

  ### 1.2 Task-Aware Communication

  Spatial confidence and perception demand guide the selection of informative regions. Sparse messages and feature compression reduce communication costs, while demand feedback adapts information exchange.

  **Key techniques:** Demand-aware region selection · Sparse feature communication · Bandwidth-constrained collaboration

  ### 1.3 Robust Fusion and 3D Scene Understanding

  Pose correction, temporal alignment, and reliability weighting address localization errors and asynchronous observations. Fusing local and neighboring features supports 3D object detection, BEV mapping, and 3D Gaussian splatting (3DGS) reconstruction.

  **Key techniques:** Spatiotemporal error compensation · Reliability-weighted fusion · 3D scene reconstruction
---

## 研究方向概述

本方向聚焦**多智能体协同感知**，面向车辆、路侧单元与无人机的协同场景，研究如何在视角遮挡、传感器异构、通信带宽受限和观测不同步的条件下，实现准确、高效、鲁棒的场景理解。

### 1.1 异构感知与特征对齐

对相机、激光雷达与空中视角观测进行本地特征编码，将不同智能体的特征对齐至统一的鸟瞰图（BEV）空间，为跨模态、跨视角协作建立共同表征。

**关键技术：** 多模态特征编码 · 异构特征对齐 · 统一 BEV 表征

### 1.2 任务驱动的高效通信

结合空间置信度与感知需求选择关键区域，通过稀疏消息传输与特征压缩减少通信开销，并利用感知需求反馈动态调整信息交换。

**关键技术：** 需求感知区域选择 · 稀疏特征通信 · 带宽受限协作

### 1.3 鲁棒融合与三维场景理解

针对位姿偏差与观测异步，研究位姿校正、时间对齐和可靠性加权，融合本地与邻居特征，支持三维目标检测、BEV 建图与三维高斯重建（3DGS）。

**关键技术：** 时空误差补偿 · 可靠性加权融合 · 三维场景重建
