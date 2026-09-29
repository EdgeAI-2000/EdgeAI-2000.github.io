---
layout: default
lang: en
mascot: heart
title: Current Openings
permalink: /en/openings/
---

<div class="container" style="margin:24px 0;">
  {% include page-heading.html title="Current Openings" %}
  <p class="lead">Join EAIS LAB: graduate opportunities for 2027 entry and research opportunities for undergraduates.</p>
  <p>We invite curious, motivated students to explore multi-agent collaborative perception, large-model inference and deployment at the edge, and agentic AI, turning promising ideas into research and real-world systems.</p>

  <h2>Who We Are Recruiting</h2>
  <ul>
    <li><strong>PhD students — 1 position for 2027 entry:</strong> For students eager to investigate challenging questions and pursue meaningful, original research in Edge AI.</li>
    <li><strong>Master's students — 8 positions for 2027 entry via the postgraduate entrance examination:</strong> For applicants who want to develop their algorithm design and system implementation skills through research and practice.</li>
    <li><strong>Undergraduate researchers — 4–5 positions:</strong> For students currently in their second or third year who are interested in research and hands-on projects.</li>
  </ul>

  <h2>How to Apply</h2>
  <p>Email <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a> with your CV and a brief introduction to your research interests. Please indicate the opportunity you are applying for, your university, major, and current year of study. You are also welcome to include transcripts, representative publications, project descriptions, or code samples, if available.</p>
  <p>Suggested email subjects:</p>
  <ul>
    <li>2027 PhD Application - Name - University</li>
    <li>2027 Master's Application (Entrance Examination) - Name - University</li>
    <li>Undergraduate Research Application - Name - University - Year of Study</li>
  </ul>
  <p>We look forward to hearing about your ideas and goals, and exploring the next step in your research journey together.</p>
  {% unless site.data.page_visibility.about == false or site.data.page_visibility.admissions == false %}
  <p><a class="link" href="{{ '/en/admissions/' | relative_url }}">Learn more about joining EAIS LAB</a></p>
  {% endunless %}
</div>
