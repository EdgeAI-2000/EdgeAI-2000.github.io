---
layout: default
lang: zh
mascot: badge
title: 关于 About
permalink: /zh/about/
---

<div class="container" style="margin:24px 0;">
  {% include page-heading.html title="关于实验室" %}
  <p class="lead">EAIS LAB（边缘智能实验室）致力于以系统与算法协同设计推动边缘智能走向真实世界，让研究成果惠及人、城市、产业与社会。</p>

  <h2>研究与愿景</h2>
  <p>我们聚焦多智能体协同感知、边缘大模型推理与部署、代理式人工智能，贯通硬件平台、系统软件、高效模型与资源调度，构建云边端协作的 AI 系统。从算法探索到系统实现，我们追求低时延、低功耗与高可靠，推动形成可复用、可验证、可部署的解决方案。</p>
  <p>面向智能交通、空中与城市感知、工业巡检及具身智能，我们希望将有价值的研究转化为真实场景中的能力，让生活更安全便捷、城市更高效可持续、产业更具生产力。</p>
  {% unless site.data.page_visibility.about == false or site.data.page_visibility.vision == false %}
  <p><a class="link" href="{{ '/zh/vision/' | relative_url }}">了解我们的愿景</a></p>
  {% endunless %}

  <h2>实验室与交流</h2>
  <p>我们的实验室分布于成都、唐山、宜宾和深圳：成都实验室位于西南交通大学犀浦校区，唐山实验室位于西南交通大学唐山园区，宜宾实验室位于西南交通大学宜宾研究院，深圳实验室位于龙华区银星智界。欢迎对边缘智能感兴趣的同学与研究伙伴联系交流。</p>
  {% unless site.data.page_visibility.about == false or site.data.page_visibility.contact == false %}
  <p><a class="link" href="{{ '/zh/contact/' | relative_url }}">查看详细地址与地图</a></p>
  {% endunless %}

  <h2>加入我们</h2>
  <p>我们长期招收<strong>博士研究生、硕士研究生，以及有志于科研探索的本科生</strong>。无论你已有研究积累，还是刚刚萌生科研兴趣，只要保持好奇、主动学习、乐于实践，都欢迎向我们介绍你的经历、想法与目标，一起把有趣的想法变成扎实的研究。</p>
  <p>招生咨询与材料投递请发送至 <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a>，附上个人简历、研究兴趣或简短自我介绍；如有代表性论文、项目或代码作品，也欢迎一并分享。</p>
  {% unless site.data.page_visibility.about == false or site.data.page_visibility.admissions == false %}
  <p><a class="link" href="{{ '/zh/admissions/' | relative_url }}">查看招生信息与投递建议</a></p>
  {% endunless %}
</div>
