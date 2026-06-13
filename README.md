# YYN Wiki 手动轮播图补丁

本补丁增加了一个简单的手动图片轮播组件，并在动态规划栏目中试用：

- `simple-dp.md`：LIS 贪心 + 二分过程 6 步轮播
- `knapsack-dp.md`：背包 DP 容量枚举方向 3 步轮播

## 使用方法

把本补丁解压后的文件复制到你的 `yyn-wiki/` 项目根目录，选择覆盖同名文件。

然后本地预览：

```bash
mkdocs serve
```

确认无误后推送：

```bash
git add .
git commit -m "add manual diagram carousel"
git push
```

## 新增文件

- `docs/assets/javascripts/carousel.js`
- `docs/assets/images/dp/lis-step-1.svg` 到 `lis-step-6.svg`
- `docs/assets/images/dp/knapsack-step-1.svg` 到 `knapsack-step-3.svg`

## 修改文件

- `mkdocs.yml`
- `docs/assets/stylesheets/extra.css`
- `docs/algorithm-templates/simple-dp.md`
- `docs/algorithm-templates/knapsack-dp.md`


## 本次修复：轮播图路径与右侧目录

- 修复轮播图在 MkDocs pretty URLs 下加载失败的问题：raw HTML 中的图片路径已由 `../assets/...` 改为 `../../assets/...`。
- 修复右侧目录中公式标题显示为反斜杠的问题：将含 LaTeX 的标题改成普通中文标题，公式保留在正文中。

覆盖补丁后重新运行 `mkdocs serve` 即可预览。
