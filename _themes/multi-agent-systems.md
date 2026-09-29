---
title: 代理式人工智能
title_en: Agentic AI
intro: 面向数字任务与具身场景，研究长期任务规划、多智能体协作与层次化记忆，通过工具调用、具身技能和环境反馈构建“目标—规划—行动—学习”闭环，提升任务完成能力、泛化性与执行可靠性。
intro_en: Long-horizon planning, multi-agent collaboration, and hierarchical memory connect tool use and embodied skills with environmental feedback to improve task completion, generalization, and reliable execution.
keywords:
  - agentic AI
  - multi-agent collaboration
  - hierarchical memory
  - embodied intelligence
  - policy learning
cover: /assets/images/research/agentic-ai.png
order: 3
layout: theme
content_en: |
  ## Research Overview

  We study **agentic AI, including embodied intelligence**, connecting user goals and multimodal observations to planning, action, and learning. Agents use tools in digital environments and invoke embodied skills in physical environments, using feedback to support long-horizon task completion, generalization, and reliable execution.

  ### 3.1 Long-Horizon Planning and Multi-Agent Collaboration

  Goal understanding, task decomposition, subtask planning, and role assignment coordinate planner, executor, and critic agents. Result evaluation and failure analysis guide replanning as tasks and environments change.

  **Key techniques:** Task decomposition · Role coordination · Tool use · Evaluation-driven replanning

  ### 3.2 Hierarchical Memory and Feedback-Based Learning

  Working context, episodic experience, and reusable knowledge support memory retrieval and updates across multiple interactions. Outcome evaluation informs memory updates and replanning, while collected interaction data supports policy learning; online execution and policy training are treated as distinct processes.

  **Key techniques:** Context management · Experience retrieval · Knowledge reuse · Agent reinforcement learning

  ### 3.3 Tool Use and Embodied Action

  An action interface connects agents to search, code execution, and APIs, as well as navigation, manipulation, and inspection skills. For UAVs and mobile robots, grounding links language goals to scene objects, skill policies produce robot actions, and visual and state feedback closes the execution loop.

  **Key techniques:** Tool orchestration · Language-to-scene grounding · Embodied skill policies · Perception–action feedback
---

## 研究方向概述

本方向聚焦**代理式人工智能（包含具身智能）**，将用户目标与多模态观测连接到规划、行动和学习。智能体在数字环境中调用工具，在物理环境中执行具身技能，并利用环境反馈提升长期任务完成能力、泛化性与执行可靠性。

### 3.1 长期任务规划与多智能体协作

通过目标理解、任务分解、子任务规划与角色分配，组织规划者、执行者和评估者协作。利用结果评估与失败分析触发重新规划，适应任务进展和环境变化。

**关键技术：** 任务分解 · 角色协调 · 工具使用 · 评估驱动的重新规划

### 3.2 层次化记忆与反馈学习

围绕工作上下文、情景经验和可复用知识构建层次化记忆，支持多轮交互中的检索与更新。以结果评估驱动记忆更新和重新规划，并利用积累的交互数据开展策略学习，区分在线执行与策略训练过程。

**关键技术：** 上下文管理 · 经验检索 · 知识复用 · 智能体强化学习

### 3.3 工具调用与具身行动

通过行动接口连接搜索、代码执行与 API，以及导航、操作和巡检等具身技能。面向无人机与移动机器人，将语言目标关联到场景对象，由技能策略生成机器人动作，并通过视觉与状态反馈形成执行闭环。

**关键技术：** 工具编排 · 语言与场景对齐 · 具身技能策略 · 感知—行动反馈
