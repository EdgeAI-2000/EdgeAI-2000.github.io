---
layout: default
lang: en
mascot: reading
title: Newcomers
description: How new members join the GitHub organization, sign in to EAIS Services, and turn on the lab services they need first.
permalink: /en/newcomers/
---

<div class="container newcomers-guide">
  {% include page-heading.html title="Newcomers" %}
  <p class="lead">If the lab portal will not open yet, start here. You can read these steps before you are in the GitHub organization.</p>

  <h2>If the portal will not let you in</h2>
  <p><a class="link" href="https://services.eaislab.com" target="_blank" rel="noopener noreferrer">EAIS Services</a> is gated by Cloudflare Access. Only members of the GitHub organization <a class="link" href="https://github.com/EdgeAI-2000" target="_blank" rel="noopener noreferrer">EdgeAI-2000</a> can sign in with a GitHub account.</p>
  <p>A failed login before you join means the access check stopped you. The page itself is fine. Ask an owner to add you, then open the portal and choose GitHub.</p>

  <ol class="guide-steps">
    <li>
      <h2>Join the GitHub organization</h2>
      <p>Organization page: <a class="link" href="https://github.com/EdgeAI-2000" target="_blank" rel="noopener noreferrer">https://github.com/EdgeAI-2000</a>.</p>
      <p>To join, or to sort out repository permissions, ask the owners for help. The portal puts it this way: contact them if you need to join the organization or fix repository permissions.</p>
      <ul>
        <li><a class="link" href="{{ '/en/people/he-chun/' | relative_url }}">Chun He</a>: <a class="link" href="mailto:hechunconor@my.swjtu.edu.cn">hechunconor@my.swjtu.edu.cn</a></li>
        <li><a class="link" href="{{ '/en/people/he-lusheng/' | relative_url }}">Lusheng He</a>: <a class="link" href="mailto:3180144965@qq.com">3180144965@qq.com</a></li>
      </ul>
      <p>Write to them and they can add you. Once you are in, you can sign in to the portal with GitHub.</p>
    </li>
    <li>
      <h2>Sign in to EAIS Services</h2>
      <p>After you are in the organization, do these in order.</p>
      <ol>
        <li>Open <a class="link" href="https://services.eaislab.com" target="_blank" rel="noopener noreferrer">https://services.eaislab.com</a> and sign in with GitHub. The service directory is there, and so are the detailed steps for the services below.</li>
        <li>Fill in your contact details at <a class="link" href="https://services.eaislab.com/contacts/" target="_blank" rel="noopener noreferrer">https://services.eaislab.com/contacts/</a> first.</li>
        <li>Then add or update your profile on the people page: <a class="link" href="https://eaislab.com/en/people/" target="_blank" rel="noopener noreferrer">https://eaislab.com/en/people/</a>.</li>
      </ol>
    </li>
  </ol>

  <h2>Opening common services</h2>

  <h3>Large-model access (Sub2API)</h3>
  <p>Sub2API is the lab's large-model access service. Zijie Zhou and Zichang Hu handle account registration, model access and setup, and balance top-ups.</p>
  <ul>
    <li><a class="link" href="{{ '/en/people/zhou-zijie/' | relative_url }}">Zijie Zhou</a>: <a class="link" href="mailto:zzj1921@my.swjtu.edu.cn">zzj1921@my.swjtu.edu.cn</a></li>
    <li><a class="link" href="{{ '/en/people/hu-zichang/' | relative_url }}">Zichang Hu</a>: <a class="link" href="mailto:hzchbc@outlook.com">hzchbc@outlook.com</a></li>
  </ul>
  <ul>
    <li>Service: <a class="link" href="https://sub2api.eaislab.com" target="_blank" rel="noopener noreferrer">https://sub2api.eaislab.com</a></li>
    <li>Console sign-in: <a class="link" href="https://sub2api.eaislab.com/login" target="_blank" rel="noopener noreferrer">https://sub2api.eaislab.com/login</a>. Your personal API key and the usage console are on this login page.</li>
    <li>Docs, after you sign in to the portal: <a class="link" href="https://services.eaislab.com/sub2api-docs/" target="_blank" rel="noopener noreferrer">https://services.eaislab.com/sub2api-docs/</a>. Those docs also list <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a>.</li>
  </ul>

  <h3>Requesting compute</h3>
  <p>After you sign in, open the <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">compute page</a> and request a machine. Owners follow the split published in the portal:</p>
  <ul>
    <li>Chengdu 4090: <a class="link" href="{{ '/en/people/wei-quanmin/' | relative_url }}">Quanmin Wei</a></li>
    <li>UAV simulation: <a class="link" href="{{ '/en/people/lv-junfeng/' | relative_url }}">Junfeng Lv</a></li>
    <li>Other GPUs in Chengdu, Yibin, and Aba: <a class="link" href="{{ '/en/people/chen-xinyu/' | relative_url }}">Xinyu Chen</a></li>
    <li>Shenzhen 4090D: <a class="link" href="{{ '/en/people/xu-xincao/' | relative_url }}">Xincao (Neil) Xu</a></li>
  </ul>

  <h3>Progress and usage</h3>
  <ul>
    <li>After you sign in, check usage on <a class="link" href="https://services.eaislab.com/progress/" target="_blank" rel="noopener noreferrer">Progress</a>.</li>
    <li>Your personal API key and the usage console stay on the <a class="link" href="https://sub2api.eaislab.com/login" target="_blank" rel="noopener noreferrer">Sub2API login page</a>.</li>
  </ul>

  <h3>Getting into 数智, and the emergency network</h3>
  <ul>
    <li>Day-to-day access to 数智 uses EasyTier.</li>
    <li>Pgyer (蒲公英) is only for emergencies.</li>
  </ul>
  <p>The steps and connection details are in the portal docs after you sign in. This public page does not include network keys, the 数智 password, or any other sign-in secret. After you join the organization and sign in, follow the service directory:</p>
  <ul>
    <li><a class="link" href="https://services.eaislab.com/tools/#easytier-sz" target="_blank" rel="noopener noreferrer">EasyTier into 数智, in the service directory</a></li>
    <li><a class="link" href="https://services.eaislab.com/network/#easytier" target="_blank" rel="noopener noreferrer">EasyTier in the network notes</a></li>
  </ul>

  <h2>Owners</h2>
  <p>This table matches the owner split in the portal. For a compute request, use the contact details on the compute page after you sign in.</p>
  <div class="owner-table-wrap">
    <table class="owner-table">
      <caption class="meta">Tasks newcomers handle first, and who owns them</caption>
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Owner</th>
          <th scope="col">How to reach them</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Join the GitHub organization, or fix repository permissions</td>
          <td><a class="link" href="{{ '/en/people/he-chun/' | relative_url }}">Chun He</a>, <a class="link" href="{{ '/en/people/he-lusheng/' | relative_url }}">Lusheng He</a></td>
          <td><a class="link" href="mailto:hechunconor@my.swjtu.edu.cn">hechunconor@my.swjtu.edu.cn</a><br><a class="link" href="mailto:3180144965@qq.com">3180144965@qq.com</a></td>
        </tr>
        <tr>
          <td>Sub2API registration, model access and setup, balance top-ups</td>
          <td><a class="link" href="{{ '/en/people/zhou-zijie/' | relative_url }}">Zijie Zhou</a>, <a class="link" href="{{ '/en/people/hu-zichang/' | relative_url }}">Zichang Hu</a></td>
          <td><a class="link" href="mailto:zzj1921@my.swjtu.edu.cn">zzj1921@my.swjtu.edu.cn</a><br><a class="link" href="mailto:hzchbc@outlook.com">hzchbc@outlook.com</a></td>
        </tr>
        <tr>
          <td>Chengdu 4090 compute</td>
          <td><a class="link" href="{{ '/en/people/wei-quanmin/' | relative_url }}">Quanmin Wei</a></td>
          <td>Request it on the <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">compute page</a> after you sign in</td>
        </tr>
        <tr>
          <td>UAV simulation compute</td>
          <td><a class="link" href="{{ '/en/people/lv-junfeng/' | relative_url }}">Junfeng Lv</a></td>
          <td>Request it on the <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">compute page</a> after you sign in</td>
        </tr>
        <tr>
          <td>Other GPUs in Chengdu, Yibin, and Aba</td>
          <td><a class="link" href="{{ '/en/people/chen-xinyu/' | relative_url }}">Xinyu Chen</a></td>
          <td>Request it on the <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">compute page</a> after you sign in</td>
        </tr>
        <tr>
          <td>Shenzhen 4090D</td>
          <td><a class="link" href="{{ '/en/people/xu-xincao/' | relative_url }}">Xincao (Neil) Xu</a></td>
          <td>Request it on the <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">compute page</a> after you sign in</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="guide-notes">
    <p>You can also find these owners in the WeChat group and contact them there.</p>
    <p>If you cannot match a task to an owner, or you cannot reach them for now, write to <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a>.</p>
  </div>
</div>
