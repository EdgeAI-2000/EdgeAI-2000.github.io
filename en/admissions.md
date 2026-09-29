---
layout: default
lang: en
mascot: heart
title: Admissions
permalink: /en/admissions/
---

<div class="container" style="margin:24px 0;">
  {% include page-heading.html title="Admissions" %}
  <p>We are recruiting PhD/Master/RA students in Edge AI (placeholder). Please email your CV and representative works to apply@example.edu.</p>
{% unless site.data.page_visibility.openings == false or site.data.page_visibility.about == false or site.data.page_visibility.admissions == false %}
  <p><a class="link" href="{{ '/en/openings/' | relative_url }}">See current openings</a></p>
{% endunless %}
</div> 