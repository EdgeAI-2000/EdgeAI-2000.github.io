---
layout: default
lang: zh
title: 基金
permalink: /zh/funding/
---

<div class="container" style="margin:24px 0 32px;">
  <h1>基金</h1>
</div>

{% assign funding = site.data.funds %}

<section class="container" style="margin-bottom:40px;">
  <div class="section-head">
    <h2>纵向项目</h2>
  </div>
  {% for group in funding.vertical %}
    <div style="margin-bottom:24px;">
      <h3 style="margin-bottom:12px;">{{ group.category_zh }}</h3>
      <div class="list">
        {% for item in group.items %}
          <article class="card">
            <h4 style="margin:0 0 6px;">{{ item.title_zh }}</h4>
            <p class="meta">
              周期：{{ item.period }}
              {% if item.role_zh %} · 角色：{{ item.role_zh }}{% endif %}
              {% if item.sponsors_zh %} · 主管单位：{{ item.sponsors_zh }}{% endif %}
              {% if item.budget_zh %} · 经费：{{ item.budget_zh }}{% endif %}
            </p>
            {% if item.description_zh %}<p style="margin:8px 0 0;">{{ item.description_zh }}</p>{% endif %}
          </article>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</section>

<section class="container" style="margin-bottom:40px;">
  <div class="section-head">
    <h2>横向合作</h2>
  </div>
  {% for group in funding.horizontal %}
    <div style="margin-bottom:24px;">
      <h3 style="margin-bottom:12px;">{{ group.category_zh }}</h3>
      <div class="list">
        {% for item in group.items %}
          <article class="card">
            <h4 style="margin:0 0 6px;">{{ item.title_zh }}</h4>
            <p class="meta">
              周期：{{ item.period }}
              {% if item.partners_zh %} · 合作伙伴：{{ item.partners_zh }}{% endif %}
              {% if item.budget_zh %} · 经费：{{ item.budget_zh }}{% endif %}
            </p>
            {% if item.description_zh %}<p style="margin:8px 0 0;">{{ item.description_zh }}</p>{% endif %}
          </article>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</section>
