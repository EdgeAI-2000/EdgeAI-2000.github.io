---
layout: default
lang: zh
mascot: reading
title: 实验室 NAS（WebDAV）
description: 用 HTTPS WebDAV 访问实验室共享存储：课程材料、数据集与作业提交。公开页面不含账号口令。
permalink: /zh/resources/nas/
---

<div class="container newcomers-guide">
  {% include page-heading.html title="实验室 NAS（WebDAV）" %}
  <p class="lead">实验室通过 HTTPS WebDAV 提供共享存储，用于课程材料、数据集与作业提交。公开页面不含账号口令；口令请向导师或管理员索取。</p>

  <h2>连接信息</h2>
  <div class="owner-table-wrap">
    <table class="owner-table">
      <caption class="meta">公开入口与共用账号；口令不在本页</caption>
      <thead>
        <tr>
          <th scope="col">项</th>
          <th scope="col">值</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>推荐入口</td>
          <td><a class="link" href="https://dav.eaislab.com" target="_blank" rel="noopener noreferrer"><code>https://dav.eaislab.com</code></a></td>
        </tr>
        <tr>
          <td>备用入口</td>
          <td><a class="link" href="https://dav.neardws.com:8443" target="_blank" rel="noopener noreferrer"><code>https://dav.neardws.com:8443</code></a></td>
        </tr>
        <tr>
          <td>协议</td>
          <td>WebDAV over HTTPS</td>
        </tr>
        <tr>
          <td>共用账号</td>
          <td><code>eaislab</code>（口令向导师或管理员索取）</td>
        </tr>
        <tr>
          <td>局域网（仅实验室内）</td>
          <td><code>https://192.168.33.87:5000</code>（仅内网；自签证书需客户端信任或忽略）</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>外出请优先使用推荐的 HTTPS WebDAV 入口。备用入口必须带端口 <code>:8443</code>。</p>

  <h2>目录约定</h2>
  <p>登录后，路径必须以 <code>/pool0/…</code> 开头：</p>
  <div class="owner-table-wrap">
    <table class="owner-table">
      <caption class="meta">登录后从 <code>/pool0/</code> 进入，不要停在站点根路径</caption>
      <thead>
        <tr>
          <th scope="col">路径</th>
          <th scope="col">用途</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>/pool0/public/</code></td>
          <td>公共共享区（所有人可见）</td>
        </tr>
        <tr>
          <td><code>/pool0/public/course/</code></td>
          <td>课程讲义 / 课件</td>
        </tr>
        <tr>
          <td><code>/pool0/public/datasets/</code></td>
          <td>公共数据集</td>
        </tr>
        <tr>
          <td><code>/pool0/public/readonly/</code></td>
          <td>只读材料（请勿覆盖）</td>
        </tr>
        <tr>
          <td><code>/pool0/public/uploads/</code></td>
          <td>作业 / 交付物上传</td>
        </tr>
        <tr>
          <td><code>/pool0/data/</code></td>
          <td>共用账号下的工作区（请按学号建子目录，避免互相覆盖）</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>建议在 <code>/pool0/data/</code> 下用自己的学号或拼音建文件夹，例如 <code>/pool0/data/2023123456/</code>。</p>

  <h2>客户端推荐</h2>

  <h3>macOS / Windows / Linux：Cyberduck 或 Mountain Duck</h3>
  <ol>
    <li>新建连接，协议选 <strong>WebDAV (HTTPS)</strong>。</li>
    <li>服务器：<code>dav.eaislab.com</code>（端口 443）。备用入口用 <code>dav.neardws.com</code>，端口 <strong>8443</strong>。</li>
    <li>用户名填写发放的共用账号 <code>eaislab</code>；密码向导师或管理员索取。</li>
    <li>打开后进入 <code>/pool0/public/</code>。</li>
  </ol>

  <h3>命令行：rclone</h3>
  <pre class="guide-code"><code>rclone config
# 类型选 webdav
# url: https://dav.eaislab.com
# vendor: other
# user / pass: 发放的账号（口令不要写进脚本仓库）</code></pre>
  <p>列目录与上传示例：</p>
  <pre class="guide-code"><code>rclone lsd labnas:/pool0/public
rclone copy ./myfile.zip labnas:/pool0/public/uploads/</code></pre>

  <h3>curl 快速自检</h3>
  <pre class="guide-code"><code># 把 USER / PASS 换成发放的账号（不要写进脚本仓库）
curl -u "$USER:$PASS" -X PROPFIND -H 'Depth: 1' https://dav.eaislab.com/pool0/public/</code></pre>

  <h2>使用规范</h2>
  <ol>
    <li><strong>公共材料</strong>放到 <code>/pool0/public/</code> 对应子目录；大文件优先压缩后再传。</li>
    <li><strong>作业</strong>交到 <code>/pool0/public/uploads/</code>，文件名带学号，例如 <code>2023123456_hw1.zip</code>。</li>
    <li>共用账号下请勿删除他人目录；不确定时先问管理员。</li>
    <li>口令仅限实验室内部使用，不要发到公开群、Issue 或网页。</li>
    <li>测速与稳定性：大文件优先 <code>dav.eaislab.com</code>；旧入口作回退。</li>
  </ol>

  <h2>常见问题</h2>

  <h3>连不上 / 451 / 401</h3>
  <p>检查用户名和口令、入口是否写对（备用入口必须带 <code>:8443</code>），以及本机时间是否大致正确。口令不在本页，请向导师或管理员索取。</p>

  <h3>只能看到空目录</h3>
  <p>确认路径以 <code>/pool0/</code> 开头，不要停在站点根路径。</p>

  <h3>上传很慢</h3>
  <p>优先换 <code>dav.eaislab.com</code>；实验室内网可试局域网地址。单流上传受家宽上行限制属正常。</p>

  <h3>需要个人独立盘</h3>
  <p>当前为共用账号方案。有特殊需求请联系管理员。</p>

  <h2>变更记录</h2>
  <ul>
    <li>2026-11-04：上线共用账号 + <code>dav.eaislab.com</code> 入口说明。</li>
  </ul>
</div>
