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
badges:
  - key: paper
    src_en: "https://img.shields.io/badge/Paper-IEEE%20TMC-0867b2?style=flat&logo=ieee&logoColor=white"
    src_zh: "https://img.shields.io/badge/%E8%AE%BA%E6%96%87-IEEE%20TMC-0867b2?style=flat&logo=ieee&logoColor=white"
    alt_en: Paper
    alt_zh: 论文
  - key: pdf
    src_en: "https://img.shields.io/badge/PDF-Download-b31b1b?style=flat"
    src_zh: "https://img.shields.io/badge/PDF-%E4%B8%8B%E8%BD%BD-b31b1b?style=flat"
    alt_en: PDF
    alt_zh: PDF
  - key: code
    src_en: "https://img.shields.io/badge/Code-GitHub-181717?style=flat&logo=github&logoColor=white"
    src_zh: "https://img.shields.io/badge/%E4%BB%A3%E7%A0%81-GitHub-181717?style=flat&logo=github&logoColor=white"
    alt_en: Code
    alt_zh: 代码
  - key: video
    src_en: "https://img.shields.io/badge/Video-Demo-0b6e99?style=flat"
    src_zh: "https://img.shields.io/badge/%E8%A7%86%E9%A2%91-%E6%BC%94%E7%A4%BA-0b6e99?style=flat"
    alt_en: Video
    alt_zh: 视频
  - key: project
    src_en: "https://img.shields.io/badge/Project-Page-0e7c66?style=flat"
    src_zh: "https://img.shields.io/badge/%E9%A1%B9%E7%9B%AE-%E4%B8%BB%E9%A1%B5-0e7c66?style=flat"
    alt_en: Project page
    alt_zh: 项目主页
demo_caption_zh: "共享字典原子留在每辆车上，在线只传输稀疏参数。参数先在空间位置与字典原子上稀疏化，再经参数共享与低比特量化；接收端用本地字典重建协同特征。"
demo_caption_en: "Shared dictionary atoms stay on each vehicle, and only sparse parameters are sent. Those parameters are sparsified over space and dictionary atoms, then shared and quantized. The receiver rebuilds collaborative features from its local dictionary."
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
figure_concept_caption_zh: "FCC 传输特征；PCC 把共享字典原子留在本地，只传输稀疏参数。"
figure_concept_caption_en: "FCC sends features; PCC keeps shared dictionary atoms local and transmits sparse parameters."
figure_method: /assets/images/projects/paracomm/framework.png
figure_method_width: 1593
figure_method_height: 629
figure_method_alt_zh: "ParaComm 整体框架：发送端由通信骨干、空间头与参数头得到空间分数和稠密参数，经联合稀疏化、分块共享和量化后传输；接收端用共享字典显式重建并精炼特征。"
figure_method_alt_en: "Overall ParaComm framework. The sender turns BEV features into sparse quantized parameters; the receiver reconstructs features with the shared dictionary and a refinement head."
figure_method_caption_zh: "接收端用本地字典重建，并由精炼头复用通信骨干。"
figure_method_caption_en: "The receiver rebuilds features with the local dictionary and a refinement head."
results_lead_zh: "下图为定性对比（图 7）与设计选择的折中分析（图 8）。"
results_lead_en: "The figures below are a qualitative comparison (Fig. 7) and a trade-off analysis (Fig. 8)."
figure_results:
  - src: https://imagedelivery.net/FNBuifN30Gov-zkgIT2tCQ/paracomm-fig7-v4/public
    width: 1366
    height: 453
    alt_zh: "ParaComm 与基线协同感知方法的鸟瞰定性对比，面板标出漏检、不准确预测和错误预测。"
    alt_en: "Qualitative bird's-eye-view comparison of ParaComm against baseline methods, with missed, inaccurate, and incorrect predictions marked."
    caption_zh: "图 7. 鸟瞰检测的定性对比，标出漏检、不准确预测和错误预测。"
    caption_en: "Fig. 7. Qualitative bird's-eye-view comparison, with missed, inaccurate, and incorrect predictions marked."
  - src: https://imagedelivery.net/FNBuifN30Gov-zkgIT2tCQ/paracomm-fig8-v4/public
    width: 1366
    height: 387
    alt_zh: "图 8 关键设计选择的折中分析：原子 top-k、可变分块大小与字典大小，比较 AP@70 与通信量。"
    alt_en: "Fig. 8 trade-off analysis of key design choices (atom top-k, variable-tile size, and dictionary size), relating AP@70 to communication volume."
    caption_zh: "图 8. 原子 top-k、可变分块大小与字典大小的折中。"
    caption_en: "Fig. 8. Trade-off of atom top-k, variable-tile size, and dictionary size."
abstract_zh: "协同感知通过让智能体共享互补的感知信息来增强自动驾驶。现有方法通常采用以特征为中心的通信（Feature-Centric Communication, FCC）视角，重点在于选择或压缩待传输的特征表示。共享的表示基为减少在线通信量提供了机会：可以用紧凑参数来编码观测。基于这一想法，我们提出以参数为中心的通信（Parameter-Centric Communication, PCC）视角，其中这些参数描述各智能体本地保留的表示基如何组合。我们将 PCC 实例化为 ParaComm，一个由可学习字典驱动、面向通信高效协同感知的框架。在 ParaComm 中，从 BEV 特征学习得到的连续参数指定如何组合共享字典原子，以形成当前的协同表示。为降低传输量，ParaComm 在空间位置与字典原子两个维度上逐步稀疏化这些参数，并进一步通过参数共享与低比特量化加以压缩。接收端再用传来的参数及其本地保存的共享字典，显式重建协同特征。在 OPV2V、V2XSet 与 DAIR-V2X 上的大量实验验证了 ParaComm 的有效性与通用性。例如在 OPV2V 上，它将通信量从 34.375 MB 降至 99.688 KB，压缩超过 350×，同时相对于标准的全特征协同仍提升了检测精度。"
abstract_en: "Collaborative perception enhances autonomous driving by allowing agents to share complementary perceptual information. Existing methods typically adopt a Feature-Centric Communication (FCC) perspective that focuses on selecting or compressing feature representations for transmission. A shared representational basis offers an opportunity to reduce online communication by encoding observations through compact parameters. Building on this idea, we introduce a Parameter-Centric Communication (PCC) perspective, in which these parameters specify the composition of representational bases retained locally at each agent. We instantiate PCC as ParaComm, a learnable dictionary-driven framework for communication-efficient collaborative perception. In ParaComm, continuous parameters learned from BEV features specify how shared dictionary atoms are combined to form the current collaborative representation. To reduce transmission volume, ParaComm progressively sparsifies these parameters across spatial locations and dictionary atoms and further compacts them through parameter sharing and low-bit quantization. The receiver then explicitly reconstructs collaborative features using the transmitted parameters and its local copy of the shared dictionary. Extensive experiments on OPV2V, V2XSet, and DAIR-V2X validate the effectiveness and generality of ParaComm. On OPV2V, for example, it reduces the communication volume from 34.375 MB to 99.688 KB, corresponding to over 350× compression, while still improving detection accuracy relative to standard full-feature collaboration."
method_zh: "发送端在空间与字典原子上稀疏化参数，再经共享与量化后传输。"
method_en: "The sender sparsifies parameters over space and dictionary atoms, then shares and quantizes them."
bibtex: |
  @article{wei2026paracomm,
    title = {Rethinking What to Communicate for Collaborative Perception: A Parameter-Centric Perspective},
    author = {Wei, Quanmin and Dai, Penglin and Li, Wei and Wu, Xiao and Chen, Chao and Yu, Zhaofei},
    journal = {IEEE Transactions on Mobile Computing},
    year = {2026}
  }
---
