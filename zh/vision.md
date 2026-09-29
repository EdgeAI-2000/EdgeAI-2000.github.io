---
layout: default
lang: zh
mascot: presenting
title: 愿景
permalink: /zh/vision/
---

<div class="container" style="margin:24px 0;">
  {% include page-heading.html title="愿景" %}
  {% assign v = site.data.vision %}
  <p class="lead">{{ v.zh }}</p>
  <div class="vision-fig">
    <img src="{{ v.image | relative_url }}" alt="{{ v.alt_zh }}" loading="lazy" />
  </div>

  <h2>系统与算法协同设计</h2>
  <p>将硬件平台、系统软件、部署流程与运行监控，同高效模型、压缩加速、任务调度和资源分配联合设计，以鲁棒性与可验证性贯穿从算法研究到可靠系统的全过程。</p>
  <h2>云边端协作的边缘智能系统</h2>
  <p>连接相机、车辆、无人机、机器人与可穿戴设备，结合边缘计算基础设施和可选云端资源，以多智能体协同感知、边缘大模型推理与部署、代理式人工智能支撑感知、推理与行动的协作。</p>
  <h2>从研究成果到真实世界价值</h2>
  <p>面向智能交通、空中与城市感知、工业巡检及具身智能，推动方案验证与规模化应用。在追求低时延、低功耗和高可靠的同时，形成可复用、可验证、可部署的解决方案，让生活更安全便捷、城市更高效可持续、产业更具生产力，为社会创造实际价值。</p>
</div> 