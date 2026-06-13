# YYN Wiki

一个轻量级的 OI Wiki 风格知识站模板，基于 MkDocs + Material for MkDocs。

## 本地运行

### 1. 安装 Python

建议使用 Python 3.10 或更高版本。

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

如果你想用虚拟环境：

```bash
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell
# .venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### 3. 本地预览

```bash
mkdocs serve
```

然后打开：

```text
http://127.0.0.1:8000
```

### 4. 构建静态文件

```bash
mkdocs build
```

构建结果会生成在 `site/` 目录。

## 写文章

所有文章都放在 `docs/` 目录下。

例如新增：

```text
docs/dp/knapsack.md
```

然后在 `mkdocs.yml` 里加导航：

```yaml
nav:
  - 首页: index.md
  - 动态规划:
      - 背包问题: dp/knapsack.md
```

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

例如仓库名叫：

```text
my-wiki
```

### 2. 上传代码

```bash
git init
git add .
git commit -m "init mkdocs wiki"
git branch -M main
git remote add origin https://github.com/你的用户名/my-wiki.git
git push -u origin main
```

### 3. 开启 GitHub Pages

进入仓库页面：

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

### 4. 等待自动部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署。

部署完成后，网站通常在：

```text
https://你的用户名.github.io/my-wiki/
```

### 5. 修改站点地址

部署成功后，建议把 `mkdocs.yml` 里的注释改成你的真实地址：

```yaml
site_url: https://你的用户名.github.io/my-wiki/
repo_url: https://github.com/你的用户名/my-wiki
repo_name: 你的用户名/my-wiki
```

## 目录结构

```text
.
├─ docs/
│  ├─ index.md
│  ├─ graph/
│  │  └─ shortest-path.md
│  ├─ math/
│  │  └─ combinatorics.md
│  └─ assets/
│     └─ stylesheets/
│        └─ extra.css
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ mkdocs.yml
├─ requirements.txt
└─ README.md
```

## 常见问题

### 搜索搜不到中文怎么办？

确认安装了 `jieba`：

```bash
pip install jieba
```

本模板已经在 `requirements.txt` 里包含了它。

### 新增页面后为什么导航里没有？

因为你需要在 `mkdocs.yml` 的 `nav` 里手动加入新页面。

### 只想手动部署可以吗？

可以：

```bash
mkdocs gh-deploy --force
```

这会把构建结果部署到 `gh-pages` 分支。

## 已导入的算法模板知识库

本版本已经把 `算法模板总结.md` 拆分到 `docs/algorithm-templates/` 目录中，并在 `mkdocs.yml` 里添加了导航。

如果你已经把项目上传到 GitHub，更新步骤：

```bash
git add .
git commit -m "add python algorithm templates"
git push
```

GitHub Actions 会自动重新构建并部署站点。

