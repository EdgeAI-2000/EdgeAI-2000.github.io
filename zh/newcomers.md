---
layout: default
lang: zh
mascot: reading
title: 新生指南
description: 新同学加入 GitHub 组织、登录 EAIS Services，以及开通常用服务的公开说明。
permalink: /zh/newcomers/
---

<div class="container newcomers-guide">
  {% include page-heading.html title="新生指南" %}
  <p class="lead">还打不开实验室门户时，先看这一页。加入 GitHub 组织之前，就可以在这里把步骤读完。</p>

  <h2>门户进不去怎么办</h2>
  <p><a class="link" href="https://services.eaislab.com" target="_blank" rel="noopener noreferrer">EAIS Services</a> 用 Cloudflare Access 控制访问。只有 GitHub 组织 <a class="link" href="https://github.com/EdgeAI-2000" target="_blank" rel="noopener noreferrer">EdgeAI-2000</a> 的成员，才能用 GitHub 账号登录。</p>
  <p>还没加入组织时登录失败，是访问控制拦住了，不是页面坏了。先联系负责人加入组织，加入成功后再打开门户，选择 GitHub 登录。</p>

  <ol class="guide-steps">
    <li>
      <h2>加入 GitHub 组织</h2>
      <p>组织页面：<a class="link" href="https://github.com/EdgeAI-2000" target="_blank" rel="noopener noreferrer">https://github.com/EdgeAI-2000</a>。</p>
      <p>加入组织，或处理仓库权限问题，请联系负责人协助。门户上的说明是：如需加入组织或处理仓库权限问题，可联系他们协助处理。</p>
      <ul>
        <li><a class="link" href="{{ '/people/he-chun/' | relative_url }}">何春</a>：<a class="link" href="mailto:hechunconor@my.swjtu.edu.cn">hechunconor@my.swjtu.edu.cn</a></li>
        <li><a class="link" href="{{ '/people/he-lusheng/' | relative_url }}">何鲁生</a>：<a class="link" href="mailto:3180144965@qq.com">3180144965@qq.com</a></li>
      </ul>
      <p>联系他们协助加入即可。加入之后，就可以用 GitHub 登录门户。</p>
    </li>
    <li>
      <h2>登录 EAIS Services</h2>
      <p>确认自己已经在组织里之后，按下面的顺序做。</p>
      <ol>
        <li>打开 <a class="link" href="https://services.eaislab.com" target="_blank" rel="noopener noreferrer">https://services.eaislab.com</a>，用 GitHub 登录。登录后能看到服务入口；下面几项的具体操作也都在门户里。</li>
        <li>先在 <a class="link" href="https://services.eaislab.com/contacts/" target="_blank" rel="noopener noreferrer">https://services.eaislab.com/contacts/</a> 填写联系方式。</li>
        <li>再到官网团队页面 <a class="link" href="https://eaislab.com/zh/people/" target="_blank" rel="noopener noreferrer">https://eaislab.com/zh/people/</a> 添加或更新个人信息。</li>
      </ol>
    </li>
  </ol>

  <h2>常用服务怎么开</h2>

  <h3>接入大模型（Sub2API）</h3>
  <p>Sub2API 是实验室的大模型接入服务。账号注册、模型接入与配置，以及余额充值，由周子杰、胡子昌负责。</p>
  <ul>
    <li><a class="link" href="{{ '/people/zhou-zijie/' | relative_url }}">周子杰</a>：<a class="link" href="mailto:zzj1921@my.swjtu.edu.cn">zzj1921@my.swjtu.edu.cn</a></li>
    <li><a class="link" href="{{ '/people/hu-zichang/' | relative_url }}">胡子昌</a>：<a class="link" href="mailto:hzchbc@outlook.com">hzchbc@outlook.com</a></li>
  </ul>
  <ul>
    <li>服务地址：<a class="link" href="https://sub2api.eaislab.com" target="_blank" rel="noopener noreferrer">https://sub2api.eaislab.com</a></li>
    <li>控制台登录：<a class="link" href="https://sub2api.eaislab.com/login" target="_blank" rel="noopener noreferrer">https://sub2api.eaislab.com/login</a>。个人 API Key 和用量控制台以这个登录页为准。</li>
    <li>使用文档在登录门户后查看：<a class="link" href="https://services.eaislab.com/sub2api-docs/" target="_blank" rel="noopener noreferrer">https://services.eaislab.com/sub2api-docs/</a>。文档中的联系邮箱还有 <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a>。</li>
  </ul>

  <h3>申请算力</h3>
  <p>登录门户后，打开 <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">算力页面</a> 按机器申请。负责人按门户里的分工：</p>
  <ul>
    <li>成都 4090：<a class="link" href="{{ '/people/wei-quanmin/' | relative_url }}">韦全敏</a></li>
    <li>无人机（UAV）仿真：<a class="link" href="{{ '/people/lv-junfeng/' | relative_url }}">吕骏峰</a></li>
    <li>其余成都、宜宾、阿坝的 GPU：<a class="link" href="{{ '/people/chen-xinyu/' | relative_url }}">陈欣雨</a></li>
    <li>深圳 4090D：<a class="link" href="{{ '/people/xu-xincao/' | relative_url }}">许新操</a></li>
  </ul>

  <h3>看进度和用量</h3>
  <ul>
    <li>登录门户后，在 <a class="link" href="https://services.eaislab.com/progress/" target="_blank" rel="noopener noreferrer">进度</a> 查看用量。</li>
    <li>个人 API Key 和用量控制台仍以 <a class="link" href="https://sub2api.eaislab.com/login" target="_blank" rel="noopener noreferrer">Sub2API 登录页</a> 为准。</li>
  </ul>

  <h3>进数智，以及应急网络</h3>
  <ul>
    <li>日常进数智用 EasyTier。</li>
    <li>蒲公英只在应急时使用。</li>
  </ul>
  <p>操作步骤和连接信息都在登录门户之后的文档里。公开网站不写网络密钥、数智密码或其他登录口令。加入组织并登录后，按「服务入口」操作：</p>
  <ul>
    <li><a class="link" href="https://services.eaislab.com/tools/#easytier-sz" target="_blank" rel="noopener noreferrer">服务入口里的 EasyTier 进数智</a></li>
    <li><a class="link" href="https://services.eaislab.com/network/#easytier" target="_blank" rel="noopener noreferrer">网络说明里的 EasyTier</a></li>
  </ul>

  <h2>负责人一览</h2>
  <p>下表与门户里的负责人分工一致。算力申请的具体联系方式，以登录后的算力页为准。</p>
  <div class="owner-table-wrap">
    <table class="owner-table">
      <caption class="meta">新生常办事项和对应负责人</caption>
      <thead>
        <tr>
          <th scope="col">事项</th>
          <th scope="col">负责人</th>
          <th scope="col">怎么联系</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>加入 GitHub 组织，处理仓库权限</td>
          <td><a class="link" href="{{ '/people/he-chun/' | relative_url }}">何春</a>、<a class="link" href="{{ '/people/he-lusheng/' | relative_url }}">何鲁生</a></td>
          <td><a class="link" href="mailto:hechunconor@my.swjtu.edu.cn">hechunconor@my.swjtu.edu.cn</a><br><a class="link" href="mailto:3180144965@qq.com">3180144965@qq.com</a></td>
        </tr>
        <tr>
          <td>Sub2API 账号注册、模型接入与配置、余额充值</td>
          <td><a class="link" href="{{ '/people/zhou-zijie/' | relative_url }}">周子杰</a>、<a class="link" href="{{ '/people/hu-zichang/' | relative_url }}">胡子昌</a></td>
          <td><a class="link" href="mailto:zzj1921@my.swjtu.edu.cn">zzj1921@my.swjtu.edu.cn</a><br><a class="link" href="mailto:hzchbc@outlook.com">hzchbc@outlook.com</a></td>
        </tr>
        <tr>
          <td>成都 4090 算力</td>
          <td><a class="link" href="{{ '/people/wei-quanmin/' | relative_url }}">韦全敏</a></td>
          <td>登录后在 <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">算力页</a> 申请</td>
        </tr>
        <tr>
          <td>无人机（UAV）仿真算力</td>
          <td><a class="link" href="{{ '/people/lv-junfeng/' | relative_url }}">吕骏峰</a></td>
          <td>登录后在 <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">算力页</a> 申请</td>
        </tr>
        <tr>
          <td>其余成都、宜宾、阿坝 GPU</td>
          <td><a class="link" href="{{ '/people/chen-xinyu/' | relative_url }}">陈欣雨</a></td>
          <td>登录后在 <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">算力页</a> 申请</td>
        </tr>
        <tr>
          <td>深圳 4090D</td>
          <td><a class="link" href="{{ '/people/xu-xincao/' | relative_url }}">许新操</a></td>
          <td>登录后在 <a class="link" href="https://services.eaislab.com/compute" target="_blank" rel="noopener noreferrer">算力页</a> 申请</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="guide-notes">
    <p>也可以直接在微信群里找到相关人员，并在群里联系他们。</p>
    <p>对不上负责人，或暂时联系不上时，写到 <a class="link" href="mailto:info@eaislab.com">info@eaislab.com</a>。</p>
  </div>
</div>
