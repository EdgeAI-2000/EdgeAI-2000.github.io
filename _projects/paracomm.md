---
layout: project_paper
lang: zh
permalink: /zh/project/paracomm/
title: "ParaComm：重新思考协同感知应当通信什么"
title_en: "ParaComm: Rethinking What to Communicate for Collaborative Perception"
description: "ParaComm 从参数视角重新思考协同感知通信：共享字典留在本地，只传输稀疏参数。TMC 2026。"
short_name: ParaComm
paper_title: "Rethinking What to Communicate for Collaborative Perception: A Parameter-Centric Perspective"
paper_title_zh: "重新思考协同感知应当通信什么：以参数为中心的视角"
date: 2026-09-29
status: active
year: 2026
venue: "IEEE Transactions on Mobile Computing (TMC 2026)"
authors:
  - name: Quanmin Wei
    name_zh: 韦全敏
    slug: wei-quanmin
  - name: Penglin Dai
    name_zh: 戴朋林
    slug: dai-penglin
    corresponding: true
  - name: Wei Li
  - name: Xiao Wu
  - name: Chao Chen
  - name: Zhaofei Yu
affiliations_zh: "西南交通大学、重庆大学、北京大学"
affiliations_en: "Southwest Jiaotong University, Chongqing University, Peking University"
pdf: https://files.eaislab.com/projects/paracomm/paper.pdf
doi: https://doi.org/10.1109/TMC.2026.3741641
paper: https://doi.org/10.1109/TMC.2026.3741641
code: https://github.com/EdgeAI-2000/ParaComm
project_page: https://weiquanmin.github.io/ParaComm/
demo_video: https://files.eaislab.com/projects/paracomm/demo.mp4
demo_poster: https://files.eaislab.com/projects/paracomm/demo-poster.jpg
# Paper badge citation count. Set a non-negative integer from Google Scholar
# when you refresh it. Leave blank to show an em dash — do not guess a number.
# The Paper badge still opens the DOI. Stars are not stored here; the Code
# badge reads them from the public GitHub API for EdgeAI-2000/ParaComm.
citations:
# PDF download count. The URL must return CORS-enabled JSON
# (Access-Control-Allow-Origin: *) with a downloads field that is a
# non-negative integer. Leave blank to keep the PDF badge as a link with no
# count. A failed or non-numeric response also hides the number.
pdf_stats_url: https://files.eaislab.com/stats/projects/paracomm/paper.json
badges:
  - key: paper
    label_en: Paper
    label_zh: 论文
    stat: citations
  - key: pdf
    label_en: PDF
    label_zh: PDF
    detail_en: Download
    detail_zh: 下载
  - key: code
    label_en: Code
    label_zh: 代码
    stat: stars
  - key: video
    label_en: Video
    label_zh: 视频
    detail_en: Demo
    detail_zh: 演示
  - key: project
    label_en: Project
    label_zh: 项目
    detail_en: Page
    detail_zh: 主页
demo_caption_zh: "共享字典原子留在每辆车上，链路上只传输稀疏参数。这些参数先在空间位置与字典原子上稀疏化，再经参数共享和低比特量化压缩。接收端用收到的参数和本地字典重建协同特征。"
demo_caption_en: "Shared dictionary atoms stay on each vehicle, and only sparse parameters are sent. Those parameters are sparsified across spatial locations and dictionary atoms, then compacted by parameter sharing and low-bit quantization. The receiver rebuilds collaborative features from the received parameters and its local dictionary."
key_results:
  - value: ">350×"
    label_zh: "OPV2V 压缩"
    label_en: "OPV2V compression"
    detail_zh: "34.375 MB → 99.688 KB"
    detail_en: "34.375 MB → 99.688 KB"
  - value_zh: "提升"
    value_en: "Improves"
    label_zh: "检测精度"
    label_en: "Detection"
    detail_zh: "相对全特征协同"
    detail_en: "Versus full-feature collaboration"
  - value: "3"
    label_zh: "数据集"
    label_en: "Datasets"
    detail_zh: "OPV2V、V2XSet、DAIR-V2X"
    detail_en: "OPV2V, V2XSet, DAIR-V2X"
summary_zh: "面向自动驾驶协同感知的参数中心通信框架。共享字典原子留在本地，在线只传输稀疏参数。"
summary_en: "A parameter-centric framework for collaborative perception. Shared dictionary atoms stay on each agent, and only sparse parameters are sent online."
themes:
  - 多模态协同感知
themes_en:
  - Collaborative Perception
highlights:
  - 以参数为中心的通信（PCC），共享字典留在本地
  - 在空间位置与字典原子上稀疏化，再做参数共享与低比特量化
  - "OPV2V：34.375 MB → 99.688 KB（超过 350× 压缩），同时提升检测精度"
highlights_en:
  - Parameter-centric communication keeps the shared dictionary local
  - Sparsify across space and dictionary atoms, then share and quantize parameters
  - "OPV2V: 34.375 MB → 99.688 KB (over 350× compression) while improving detection"
cover: /assets/images/projects/paracomm/fcc-vs-pcc.png
cover_width: 843
cover_height: 498
figure_concept: /assets/images/projects/paracomm/fcc-vs-pcc.png
figure_concept_width: 843
figure_concept_height: 498
figure_concept_alt_zh: "示意图：以特征为中心的通信传输 BEV 特征或压缩特征；以参数为中心的通信只传输相对共享字典原子的稀疏参数。"
figure_concept_alt_en: "Diagram comparing feature-centric communication, which sends BEV or compressed features, with parameter-centric communication, which sends only sparse parameters over shared dictionary atoms."
concept_zh: "以特征为中心的通信（FCC）传输 BEV 特征或其压缩表示。这些特征仍把共享语义基与随观测变化的成分混在一起，因此报文里有不少每辆车都可以本地保存的结构。以参数为中心的通信（PCC）把共享基作为字典原子留在本地，只为变化成分传输稀疏参数。通信资源于是集中在对协同真正有用的差异上。"
concept_en: "Feature-Centric Communication (FCC) transmits BEV features or their compressed representations. Those features still mix shared semantic bases with observation-specific variations, so much of the message repeats structure every agent could store locally. Parameter-Centric Communication (PCC) keeps the shared bases locally as dictionary atoms and sends only sparse parameters for the variations. Communication is then spent on the differences that matter for collaboration."
figure_concept_caption_zh: "FCC 传输特征或压缩特征；PCC 只传输相对共享字典原子的稀疏参数。"
figure_concept_caption_en: "FCC transmits features or compressed features; PCC transmits sparse parameters over shared dictionary atoms."
figure_method: /assets/images/projects/paracomm/framework.png
figure_method_width: 1593
figure_method_height: 629
figure_method_alt_zh: "ParaComm 整体框架：发送端由通信骨干、空间头与参数头得到空间分数和稠密参数，经联合稀疏化、分块共享和量化后传输；接收端用共享字典显式重建并精炼特征。"
figure_method_alt_en: "Overall ParaComm framework. The sender turns BEV features into sparse quantized parameters; the receiver reconstructs features with the shared dictionary and a refinement head."
figure_method_caption_zh: "发送端输出稀疏量化参数；接收端用本地字典重建，精炼头复用通信骨干。"
figure_method_caption_en: "The sender emits sparse quantized parameters. The receiver rebuilds features with its local dictionary, and the Refinement Head reuses the Communication Backbone."
results_lead_zh: "图 7 把 ParaComm 与基线协同检测方法的鸟瞰结果并排展示，并标出漏检、不准确预测和错误预测。图 8 扫描原子 top-k、可变分块大小和字典大小，比较 AP@70 与通信量。两图合在一起，用来看减少报文之后检测是否仍然可用。"
results_lead_en: "Fig. 7 places ParaComm beside baseline collaborative detectors in bird's-eye view and marks missed, inaccurate, and incorrect predictions. Fig. 8 sweeps atom top-k, variable-tile size, and dictionary size, relating AP@70 to communication volume. Read together, they show whether cutting the message still leaves the detections usable."
figure_results:
  - src: https://imagedelivery.net/FNBuifN30Gov-zkgIT2tCQ/paracomm-fig7-v4/public
    width: 1366
    height: 453
    alt_zh: "ParaComm 与基线协同感知方法的鸟瞰定性对比，面板标出漏检、不准确预测和错误预测。"
    alt_en: "Qualitative bird's-eye-view comparison of ParaComm against baseline methods, with missed, inaccurate, and incorrect predictions marked."
    caption_zh: "图 7. 鸟瞰定性对比，标出漏检、不准确预测和错误预测。"
    caption_en: "Fig. 7. Qualitative bird's-eye-view comparison, with missed, inaccurate, and incorrect predictions marked."
  - src: https://imagedelivery.net/FNBuifN30Gov-zkgIT2tCQ/paracomm-fig8-v4/public
    width: 1366
    height: 387
    alt_zh: "图 8 关键设计选择的折中分析：原子 top-k、可变分块大小与字典大小，比较 AP@70 与通信量。"
    alt_en: "Fig. 8 trade-off analysis of key design choices (atom top-k, variable-tile size, and dictionary size), relating AP@70 to communication volume."
    caption_zh: "图 8. 原子 top-k、可变分块大小与字典大小：AP@70 对通信量。"
    caption_en: "Fig. 8. Atom top-k, variable-tile size, and dictionary size: AP@70 against communication volume."
abstract_zh: "协同感知通过让智能体共享互补的感知信息来增强自动驾驶。现有方法通常采用以特征为中心的通信（Feature-Centric Communication, FCC）视角，重点在于选择或压缩待传输的特征表示。共享的表示基为减少在线通信量提供了机会：可以用紧凑参数来编码观测。基于这一想法，我们提出以参数为中心的通信（Parameter-Centric Communication, PCC）视角，其中这些参数描述各智能体本地保留的表示基如何组合。我们将 PCC 实例化为 ParaComm，一个由可学习字典驱动、面向通信高效协同感知的框架。在 ParaComm 中，从 BEV 特征学习得到的连续参数指定如何组合共享字典原子，以形成当前的协同表示。为降低传输量，ParaComm 在空间位置与字典原子两个维度上逐步稀疏化这些参数，并进一步通过参数共享与低比特量化加以压缩。接收端再用传来的参数及其本地保存的共享字典，显式重建协同特征。在 OPV2V、V2XSet 与 DAIR-V2X 上的大量实验验证了 ParaComm 的有效性与通用性。例如在 OPV2V 上，它将通信量从 34.375 MB 降至 99.688 KB，压缩超过 350×，同时相对于标准的全特征协同仍提升了检测精度。"
abstract_en: "Collaborative perception enhances autonomous driving by allowing agents to share complementary perceptual information. Existing methods typically adopt a Feature-Centric Communication (FCC) perspective that focuses on selecting or compressing feature representations for transmission. A shared representational basis offers an opportunity to reduce online communication by encoding observations through compact parameters. Building on this idea, we introduce a Parameter-Centric Communication (PCC) perspective, in which these parameters specify the composition of representational bases retained locally at each agent. We instantiate PCC as ParaComm, a learnable dictionary-driven framework for communication-efficient collaborative perception. In ParaComm, continuous parameters learned from BEV features specify how shared dictionary atoms are combined to form the current collaborative representation. To reduce transmission volume, ParaComm progressively sparsifies these parameters across spatial locations and dictionary atoms and further compacts them through parameter sharing and low-bit quantization. The receiver then explicitly reconstructs collaborative features using the transmitted parameters and its local copy of the shared dictionary. Extensive experiments on OPV2V, V2XSet, and DAIR-V2X validate the effectiveness and generality of ParaComm. On OPV2V, for example, it reduces the communication volume from 34.375 MB to 99.688 KB, corresponding to over 350× compression, while still improving detection accuracy relative to standard full-feature collaboration."
method_zh: "ParaComm 是面向协同感知的、以参数为中心的通信流水线。在发送端，共享的通信骨干（Communication Backbone）与空间头（Space Head）、原子头（Atom Head）一起产生空间分数，以及字典原子上的稠密参数。联合空间-原子稀疏化（Joint Space-Atom Sparsification）用空间分数在位置和原子两个维度上稀疏这些参数。可变分块参数共享（Variable-Tile Parameter Sharing）和量化表示（Quantized Representation）再把它们压成待传输参数。接收端用传来的参数和本地字典原子显式重建协同特征。轻量的精炼头（Refinement Head）复用通信骨干，在不再引入第二套骨干网络的情况下提升特征质量。"
method_en: "ParaComm is a parameter-centric communication pipeline for collaborative perception. On the sender, a shared Communication Backbone, together with the Space Head and the Atom Head, produces a spatial score and dense parameters over dictionary atoms. Joint Space-Atom Sparsification uses that score to thin the parameters across locations and atoms. Variable-Tile Parameter Sharing and Quantized Representation then compact them into the transmitted message. The receiver reconstructs collaborative features from the message and its local dictionary atoms. A lightweight Refinement Head, which reuses the Communication Backbone, improves those features without a second full backbone."
bibtex: |
  @article{wei2026paracomm,
    title = {Rethinking What to Communicate for Collaborative Perception: A Parameter-Centric Perspective},
    author = {Wei, Quanmin and Dai, Penglin and Li, Wei and Wu, Xiao and Chen, Chao and Yu, Zhaofei},
    journal = {IEEE Transactions on Mobile Computing},
    year = {2026}
  }
---
