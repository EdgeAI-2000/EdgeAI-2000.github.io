---
layout: default
lang: en
title: Funding
permalink: /en/funding/
---

<div class="container" style="margin:24px 0 32px;">
  <h1>Funding Portfolio</h1>
</div>

{% assign funding = site.data.funds %}

<section class="container" style="margin-bottom:40px;">
  <div class="section-head">
    <h2>Vertical Programs</h2>
  </div>
  {% for group in funding.vertical %}
    <div style="margin-bottom:24px;">
      <h3 style="margin-bottom:12px;">{{ group.category_en }}</h3>
      <div class="list">
        {% for item in group.items %}
          <article class="card">
            <h4 style="margin:0 0 6px;">{{ item.title_en }}</h4>
            <p class="meta">
              Period: {{ item.period }}
              {% if item.role_en %} · Role: {{ item.role_en }}{% endif %}
              {% if item.sponsors_en %} · Sponsor: {{ item.sponsors_en }}{% endif %}
              {% if item.budget_en %} · Budget: {{ item.budget_en }}{% endif %}
            </p>
            {% if item.description_en %}<p style="margin:8px 0 0;">{{ item.description_en }}</p>{% endif %}
          </article>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</section>

<section class="container" style="margin-bottom:40px;">
  <div class="section-head">
    <h2>Industry & Joint Initiatives</h2>
  </div>
  {% for group in funding.horizontal %}
    <div style="margin-bottom:24px;">
      <h3 style="margin-bottom:12px;">{{ group.category_en }}</h3>
      <div class="list">
        {% for item in group.items %}
          <article class="card">
            <h4 style="margin:0 0 6px;">{{ item.title_en }}</h4>
            <p class="meta">
              Period: {{ item.period }}
              {% if item.partners_en %} · Partner: {{ item.partners_en }}{% endif %}
              {% if item.budget_en %} · Budget: {{ item.budget_en }}{% endif %}
            </p>
            {% if item.description_en %}<p style="margin:8px 0 0;">{{ item.description_en }}</p>{% endif %}
          </article>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</section>
