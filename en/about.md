---
layout: default
lang: en
mascot: badge
title: About
permalink: /en/about/
---

<div class="container" style="margin:24px 0;">
  {% include page-heading.html title="About the Lab" %}
  <p class="lead">EAIS Lab (Edge AI &amp; Systems Lab) brings Edge AI into the real world through system–algorithm co-design, pursuing research that benefits people, cities, industries, and society.</p>

  <h2>Research and Vision</h2>
  <p>Our research focuses on multi-agent collaborative perception, large-model inference and deployment at the edge, and agentic AI. We bring together hardware platforms, system software, efficient models, and resource scheduling to build collaborative device–edge–cloud AI systems. From algorithm design to system implementation, we target low latency, low power, and high reliability, working toward reusable, verifiable, and deployable solutions.</p>
  <p>We explore applications in intelligent transportation, aerial and urban sensing, industrial inspection, and embodied AI. Our goal is to translate research into practical capabilities that support safer and more convenient lives, efficient and sustainable cities, and more productive industries.</p>
  {% unless site.data.page_visibility.about == false or site.data.page_visibility.vision == false %}
  <p><a class="link" href="{{ '/en/vision/' | relative_url }}">Explore our vision</a></p>
  {% endunless %}

  <h2>Locations and Connections</h2>
  <p>Our laboratories are located in Chengdu, Tangshan, Yibin, and Shenzhen: at Southwest Jiaotong University's Xipu Campus in Chengdu, its Tangshan Campus, its Yibin Research Institute, and Yinxing Zhijie in Shenzhen's Longhua District. We welcome students and research partners interested in Edge AI to get in touch and exchange ideas.</p>
  {% unless site.data.page_visibility.about == false or site.data.page_visibility.contact == false %}
  <p><a class="link" href="{{ '/en/contact/' | relative_url }}">View addresses and maps</a></p>
  {% endunless %}

  <h2>Join Us</h2>
  <p>We welcome inquiries from <strong>prospective PhD students, master's students, and undergraduates interested in research</strong> throughout the year. Whether you have research experience or are just discovering your interests, we value curiosity, initiative, and a willingness to build and experiment. Tell us about your background, ideas, and goals, and help us turn promising ideas into rigorous research.</p>
  <p>For admissions inquiries and applications, email <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a> with your CV and a short introduction or statement of research interests. You are also welcome to share representative publications, projects, or code samples, if available.</p>
  {% unless site.data.page_visibility.about == false or site.data.page_visibility.admissions == false %}
  <p><a class="link" href="{{ '/en/admissions/' | relative_url }}">View admissions information and application guidance</a></p>
  {% endunless %}
</div>
