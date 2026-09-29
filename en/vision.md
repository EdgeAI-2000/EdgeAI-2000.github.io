---
layout: default
lang: en
mascot: presenting
title: Vision
permalink: /en/vision/
---

<div class="container" style="margin:24px 0;">
  {% include page-heading.html title="Vision" %}
  {% assign v = site.data.vision %}
  <p class="lead">{{ v.en }}</p>
  <div class="vision-fig">
    <img src="{{ v.image | relative_url }}" alt="{{ v.alt_en }}" loading="lazy" />
  </div>

  <h2>System–Algorithm Co-Design</h2>
  <p>We jointly design hardware platforms, system software, deployment pipelines, and runtime monitoring with efficient models, compression and acceleration, task scheduling, and resource allocation. Robustness and verification guide the path from algorithms to reliable systems.</p>
  <h2>Collaborative Edge AI Systems</h2>
  <p>We connect cameras, vehicles, UAVs, robots, and wearable devices with edge computing infrastructure and optional cloud resources. Multi-agent collaborative perception, edge LLM inference and deployment, and agentic AI provide complementary capabilities for sensing, reasoning, and action.</p>
  <h2>From Research to Real-World Impact</h2>
  <p>We aim to validate and scale solutions in intelligent transportation, aerial and urban sensing, industrial inspection, and embodied AI. We pursue low latency, low power, and high reliability while making our solutions reusable, verifiable, and deployable—supporting safer and more convenient lives, efficient and sustainable cities, productive industries, and broader societal benefits.</p>
</div> 