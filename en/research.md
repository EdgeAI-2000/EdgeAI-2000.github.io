---
layout: default
lang: en
title: Research
permalink: /en/research/
---

{% unless site.data.page_visibility.research == false or site.data.page_visibility.themes == false %}
<div class="container" style="margin:24px 0;">
  <h1>Research</h1>
  {% unless site.data.page_visibility.themes == false %}
  <section style="margin-top:12px;">
    <h2>Themes</h2>
    <p class="meta">Explore our primary research themes.</p>
    <p><a class="link" href="{{ '/en/themes/' | relative_url }}">Browse Themes</a></p>
  </section>
  {% endunless %}

  {% unless site.data.page_visibility.projects == false or site.data.page_visibility.themes == false %}
  <section style="margin-top:12px;">
    <h2>Projects</h2>
    <p class="meta">Engineering and prototypes.</p>
    <p><a class="link" href="{{ '/en/projects/' | relative_url }}">Browse Projects</a></p>
  </section>
  {% endunless %}

  {% unless site.data.page_visibility.publications == false or site.data.page_visibility.themes == false %}
  <section style="margin-top:12px;">
    <h2>Publications</h2>
    <p class="meta">Academic outputs and materials.</p>
    <p><a class="link" href="{{ '/en/publications/' | relative_url }}">Browse Publications</a></p>
  </section>
  {% endunless %}

  {% unless site.data.page_visibility.patents == false or site.data.page_visibility.themes == false %}
  <section style="margin-top:12px;">
    <h2>Patents</h2>
    <p class="meta">Inventions and technology transfer.</p>
    <p><a class="link" href="{{ '/patents/' | relative_url }}">Browse Patents</a></p>
  </section>
  {% endunless %}
</div>
{% endunless %}
