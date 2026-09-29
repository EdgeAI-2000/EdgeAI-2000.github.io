---
layout: default
lang: en
mascot: heart
title: Admissions
permalink: /en/admissions/
---

<div class="container" style="margin:24px 0;">
  {% include page-heading.html title="Admissions" %}
  <p class="lead">Join EAIS LAB — turn your curiosity into the starting point for discovery.</p>
  <p>We welcome inquiries from <strong>prospective PhD students, master's students, and undergraduates interested in research</strong> throughout the year. Our research focuses on multi-agent collaborative perception, large-model inference and deployment at the edge, and agentic AI, connecting algorithmic advances with real-world systems. If you enjoy exploring AI, building things, and asking new questions, we would love to hear from you.</p>

  <h2>Who we are looking for</h2>
  <ul>
    <li><strong>PhD students:</strong> Motivated researchers eager to investigate challenging questions and pursue meaningful, original research.</li>
    <li><strong>Master's students:</strong> Students interested in AI and edge computing who want to develop their algorithm design and system implementation skills through research and practice.</li>
    <li><strong>Undergraduates:</strong> Curious, proactive learners ready to take their first steps in research through hands-on projects and research training.</li>
  </ul>
  <p>Whether you already have research experience or are just beginning to explore your interests, we welcome an introduction to your background, ideas, and goals.</p>

  <h2>Get in touch</h2>
  <p>Please send your CV and a short introduction or statement of research interests to <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a>. You are also welcome to include transcripts, representative publications, project descriptions, or code samples, if available.</p>
  <p>Suggested email subject: <strong>Admissions Inquiry - PhD/Master's/Undergraduate - Name - University</strong>.</p>
  <p>We look forward to turning promising ideas into rigorous research with you, and bringing AI into the real world.</p>
{% unless site.data.page_visibility.openings == false or site.data.page_visibility.about == false or site.data.page_visibility.admissions == false %}
  <p><a class="link" href="{{ '/en/openings/' | relative_url }}">See current openings</a></p>
{% endunless %}
</div>
