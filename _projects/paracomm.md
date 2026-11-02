---
layout: project_paper
lang: zh
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
pdf: https://weiquanmin.github.io/ParaComm/static/pdfs/paper_paracomm.pdf
doi: https://doi.org/10.1109/TMC.2026.3741641
paper: https://doi.org/10.1109/TMC.2026.3741641
code: https://github.com/fengxueguiren/ParaComm
project_page: https://weiquanmin.github.io/ParaComm/
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
figure_concept_caption_zh: "以特征为中心的通信（FCC）与以参数为中心的通信（PCC）。FCC 传输特征或其压缩后的特征表示，其中仍混合了共享语义基与随观测变化的成分。PCC 则通过字典原子把共享基保留在本地，只为后者传输稀疏参数。因此，PCC 把通信资源集中在对协同最有信息量的差异上。"
figure_concept_caption_en: "Feature-Centric Communication (FCC) versus Parameter-Centric Communication (PCC). FCC transmits features or their compressed feature representations, which still mix shared semantic bases with observation-specific variations. PCC instead keeps the shared bases locally through dictionary atoms and communicates only sparse parameters for the latter. Therefore, PCC concentrates communication resources on the most informative differences for collaboration."
figure_method: /assets/images/projects/paracomm/framework.png
figure_method_width: 1593
figure_method_height: 629
figure_method_alt_zh: "ParaComm 整体框架：发送端由通信骨干、空间头与参数头得到空间分数和稠密参数，经联合稀疏化、分块共享和量化后传输；接收端用共享字典显式重建并精炼特征。"
figure_method_alt_en: "Overall ParaComm framework. The sender turns BEV features into sparse quantized parameters; the receiver reconstructs features with the shared dictionary and a refinement head."
figure_method_caption_zh: "图：ParaComm 整体框架。"
figure_method_caption_en: "Figure: overall framework of ParaComm."
abstract_zh: "协同感知通过让智能体共享互补的感知信息来增强自动驾驶。现有方法通常采用以特征为中心的通信（Feature-Centric Communication, FCC）视角，重点在于选择或压缩待传输的特征表示。共享的表示基为减少在线通信量提供了机会：可以用紧凑参数来编码观测。基于这一想法，我们提出以参数为中心的通信（Parameter-Centric Communication, PCC）视角，其中这些参数描述各智能体本地保留的表示基如何组合。我们将 PCC 实例化为 ParaComm，一个由可学习字典驱动、面向通信高效协同感知的框架。在 ParaComm 中，从 BEV 特征学习得到的连续参数指定如何组合共享字典原子，以形成当前的协同表示。为降低传输量，ParaComm 在空间位置与字典原子两个维度上逐步稀疏化这些参数，并进一步通过参数共享与低比特量化加以压缩。接收端再用传来的参数及其本地保存的共享字典，显式重建协同特征。在 OPV2V、V2XSet 与 DAIR-V2X 上的大量实验验证了 ParaComm 的有效性与通用性。例如在 OPV2V 上，它将通信量从 34.375 MB 降至 99.688 KB，压缩超过 350×，同时相对于标准的全特征协同仍提升了检测精度。"
abstract_en: "Collaborative perception enhances autonomous driving by allowing agents to share complementary perceptual information. Existing methods typically adopt a Feature-Centric Communication (FCC) perspective that focuses on selecting or compressing feature representations for transmission. A shared representational basis offers an opportunity to reduce online communication by encoding observations through compact parameters. Building on this idea, we introduce a Parameter-Centric Communication (PCC) perspective, in which these parameters specify the composition of representational bases retained locally at each agent. We instantiate PCC as ParaComm, a learnable dictionary-driven framework for communication-efficient collaborative perception. In ParaComm, continuous parameters learned from BEV features specify how shared dictionary atoms are combined to form the current collaborative representation. To reduce transmission volume, ParaComm progressively sparsifies these parameters across spatial locations and dictionary atoms and further compacts them through parameter sharing and low-bit quantization. The receiver then explicitly reconstructs collaborative features using the transmitted parameters and its local copy of the shared dictionary. Extensive experiments on OPV2V, V2XSet, and DAIR-V2X validate the effectiveness and generality of ParaComm. On OPV2V, for example, it reduces the communication volume from 34.375 MB to 99.688 KB, corresponding to over 350× compression, while still improving detection accuracy relative to standard full-feature collaboration."
method_zh: "ParaComm 是一条面向协同感知的、以参数为中心的通信流水线。在发送端，共享的通信骨干网络（Communication Backbone）与空间头（Space Head）、原子头（Atom Head）共同产生空间分数和原子级稠密参数。空间分数用于联合空间-原子稀疏化（Joint Space-Atom Sparsification），以稀疏化稠密参数；这些参数再经可变分块参数共享（Variable-Tile Parameter Sharing）和量化表示（Quantized Representation）进一步压缩，形成待传输参数。待传输参数送到接收端后，接收端使用本地共享的字典原子进行显式重建，并由轻量的精炼头（Refinement Head）进一步精炼。精炼阶段复用通信骨干网络，从而减少额外参数与计算，同时提升特征质量。"
method_en: "Overall framework of ParaComm, a Parameter-Centric Communication pipeline for collaborative perception. On the sender side, a shared Communication Backbone, together with Space and Atom Heads, produces a spatial score and atom-level dense parameters. The spatial score is used in Joint Space-Atom Sparsification to sparsify the dense parameters, which are then further compacted by Variable-Tile Parameter Sharing and Quantized Representation to form the transmitted parameters. The resulting transmitted parameters are sent to the receiver, where they are explicitly reconstructed using locally shared dictionary atoms and further refined by a lightweight Refinement Head. The refinement stage reuses the Communication Backbone, reducing additional parameters and computation while improving feature quality."
bibtex: |
  @article{wei2026paracomm,
    title = {Rethinking What to Communicate for Collaborative Perception: A Parameter-Centric Perspective},
    author = {Wei, Quanmin and Dai, Penglin and Li, Wei and Wu, Xiao and Chen, Chao and Yu, Zhaofei},
    journal = {IEEE Transactions on Mobile Computing},
    year = {2026}
  }
---
