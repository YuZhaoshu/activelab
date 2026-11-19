# ActiveLab 项目主页

ActiveLab 的静态学术项目主页，目标地址为 [yuzhaoshu.github.io/activelab/](https://yuzhaoshu.github.io/activelab/)。本仓库用于维护和发布项目网站。直接使用 HTML、CSS 和原生 JavaScript。网站界面使用英文。

网站采用 benchmark 论文主页的阅读顺序，从标题和论文资源进入 Abstract、Benchmark、Tasks and demonstrations、Dataset、Evaluation 和 BibTeX。主动观测、精细操作和主动手眼协同是同一化学任务的三个并列考察维度。任务区分别呈现视角对比、技能近景和完整实验，评估区用于发布正式协议与结果。

## 设计参考

| 参考 | 借鉴到 ActiveLab 的设计 |
| --- | --- |
| [Vision in Action](https://vision-in-action.github.io/) | 首屏留给项目主视频。把主动感知的动机放在对比前，同一案例的固定视角和主动视角并排展示。 |
| [SaPaVe](https://lmzpai.github.io/SaPaVe/) | 概述配合方法图和图注，评估区呈现已公开的实验结果。 |
| [Active Visual Fixation](https://avf-icra.github.io/) | 借鉴按任务选择片段的交互。ActiveLab 使用按类别筛选的视频网格和原生播放器。 |
| [ORGANA](https://ac-rad.github.io/organa/) | 给完整化学实验视频保留宽屏空间。ActiveLab 在视频旁增加可跳转的实验步骤。 |
| [AtomicVLA](https://zhanglk9.github.io/atomicvla-web/) | 让技能、长程执行和条件对比各有独立入口，便于从动作看回完整任务。 |

二级参考用于补充组织方式。ActiveScale 采用目录导航，ActiveVLA 以视频打开主题，EFM、SCALE 和 AVA-VLA 用实验条件或视图解释感知问题。Compose by Focus、RoboTwin 和 Chemistry Lab Automation 提供技能、任务与实验素材的组织参考。站点沿用学术页的短导航、宽幅媒体、紧凑图注和可选 BibTeX，首屏并排呈现标题、论文资源与实机照片。示范帧、任务目录和数据快照分别呈现。导航随阅读位置高亮。对比与 Rollout 在窄屏上改为单列。 [ActiveScale](https://active-scale.github.io/) · [ActiveVLA](https://zhenyangliu.github.io/ActiveVLA/) · [EFM](https://efmanipulation.github.io/) · [SCALE](https://dcahn12.github.io/projects/scale/) · [AVA-VLA](https://liauto-dsr.github.io/AVA-VLA-Page/) · [Compose by Focus](https://computationalrobotics.seas.harvard.edu/SkillComposition/) · [RoboTwin](https://robotwin-platform.github.io/) · [Chemistry Lab Automation](https://ac-rad.github.io/robot-chemist-tamp/) · [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template)

网站内置 Lenis 1.3.27 和 Geist 网页字体，许可证随文件保存。开启系统「减少动态效果」时，页面使用即时跳转并关闭入场动画。 [Lenis](https://github.com/darkroomengineering/lenis) · [Geist](https://github.com/vercel/geist-font)

任务目录按已处理数据中的操作类型分组，组合任务由原始任务描述概括。数据规模采用 2026-11-17 的处理后快照，轨迹时长按 episode 计入一次。示范配图来自项目记录的主动相机帧。

## 本地预览

从仓库的上一级目录启动服务器，可按 GitHub Pages 的子路径预览。

```sh
cd '/Users/zhaoshuyu/user/Paper&Study/Embodied AI/VLA/ActiveVLA/ActiveLab'
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 [本地 ActiveLab 页面](http://127.0.0.1:8000/activelab/)。预览结束按 Ctrl+C。

## 更新网页内容

素材准备好后，在仓库下创建 `assets/media/`，放入已获发布许可的 MP4、封面或 SVG/PNG 方法图。视频通常使用 H.264 MP4，字幕使用 WebVTT。素材路径写成相对于项目页的路径，例如 `./assets/media/<文件名>`。外部素材可使用完整 HTTPS URL，视频 URL 应直接指向可播放文件。

编辑 `assets/content.js` 填写以下字段。项目名称与首页标题在 `index.html`，样式在 `assets/site.css`。

| 字段 | 填写方式 |
| --- | --- |
| `authors`、`affiliations` | 字符串数组，按正式顺序填写。 |
| `links` | `{ label, purpose?, url }` 数组。arXiv 用于论文，GitHub 用于课题代码，Hugging Face 用于模型或数据。保留 `url: null` 显示禁用按钮，填入正式 URL 后即可打开。页面导航中的 Website source 指向网页仓库。 |
| `hero` | `{ src, poster?, caption?, captions? }`。设置主视频后，播放器会替换首屏的三臂实机照片。 |
| `overview`、`protocol`、`results` | `{ text, figure?: { src, alt, caption? } }`。分别填写正式摘要、评估协议与结果。正文以空行分段。 |
| `comparisons` | `{ title, caption?, fixed, active }` 数组。两侧各为 `{ src, label?, poster?, captions? }`。用同一任务、同一时间起点的片段。访客可以从头同时播放两侧。 |
| `skills` | `{ title, category?, src, poster?, caption?, captions? }` 数组。`category` 会自动生成过滤项。近景素材优先覆盖工具对齐、接触点及接触后的动作。 |
| `rollouts` | `{ title, src, poster?, caption?, captions?, steps? }` 数组。`steps` 由 `{ time, label, observation?, manipulation? }` 组成，`time` 为视频起点后的秒数，可用小数。两个可选文本跟随当前章节显示，分别说明此时的观测与操作。可用已对齐的分屏视频同时展示机载画面和工作区。 |
| `bibtex` | 正式 BibTeX 文本，可用 JS 模板字符串保留换行。 |

表中的 `?` 表示字段可省略，无需写入配置。视频的 `captions` 是 `{ src, label, lang }` 数组，其中 `lang` 使用 `en` 或 `zh` 等语言代码。视频、评估协议和结果采用待补提示。正式摘要填入后替换默认项目简介，BibTeX 在填入引用后显示。

## 发布到 GitHub Pages

1. 在本地预览，确认文件和待公开内容。提交并推送当前 `main`。

   ```sh
   cd '/Users/zhaoshuyu/user/Paper&Study/Embodied AI/VLA/ActiveVLA/ActiveLab/activelab'
   git status --short
   git add .gitignore .nojekyll README.md index.html assets/
   git diff --cached --stat
   git commit -m "Add ActiveLab project page"
   git push -u origin main
   ```

2. 如需首次配置或核对发布源，打开仓库的 [Settings → Pages](https://github.com/YuZhaoshu/activelab/settings/pages)。在 **Build and deployment** 里选择 **Deploy from a branch**，分支选 **main**，目录选 **/ (root)**，然后 **Save**。 [GitHub Pages 发布源文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
3. 在 [Actions](https://github.com/YuZhaoshu/activelab/actions) 查看 `pages build and deployment`。成功后打开 [公开站点](https://yuzhaoshu.github.io/activelab/)，检查视频、图片和移动端布局。

## 后续同步

GitHub 上有新提交时，先在无未提交改动的状态下运行 `git pull --ff-only`。每次网站更新通过本地验证后，将相关文件提交并推送到 `main`。Pages 会在 `main` 更新后重新部署。

```sh
git add assets/ index.html
git diff --cached --stat
git commit -m "Update ActiveLab project content"
git push
```

如果本次只更新某些素材，`git add` 时可直接指定被修改的文件。若部署后显示旧视频，核对 Actions 是否部署了最新提交，并刷新浏览器缓存。若资源返回 404，检查文件是否随提交推送、路径是否以 `./assets/` 开头，以及文件名大小写是否一致。
