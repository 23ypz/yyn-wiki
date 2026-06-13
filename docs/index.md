---
tags:
  - yyn
---

# 首页 <span class="yyn-badge">yyn</span>

欢迎来到 **YYN Wiki**。

这是一个带有 `yyn` 标识的轻量级知识站模板，适合用来整理算法笔记、课程笔记、题解和学习资料。

## 已经包含的功能

- Markdown 写作
- 左侧导航和页面目录
- 站内搜索
- 中文搜索分词支持
- 代码高亮
- 数学公式
- 深色 / 浅色模式
- GitHub Pages 自动部署
- 自定义项目名称和 `yyn` 标签

## 写作示例

行内公式：$O(n \log n)$。

块级公式：

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

代码块：

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello, YYN Wiki!" << '\n';
    return 0;
}
```

!!! tip "提示"
    你可以在 `docs/` 目录下新增 Markdown 文件，然后在 `mkdocs.yml` 的 `nav` 里加入它。

## Python 算法模板知识库

已经导入你的 Python 算法模板总结，并按 OI Wiki 风格拆成顶部大类导航：

- [总览](algorithm-templates/index.md)
- 基础：二分、排序、位运算
- 前缀与差分：前缀和、差分
- 数据结构：并查集、堆、单调数据结构、有序列表、树形数据结构
- 图论与树：BFS、DFS、最短路、最近公共祖先
- 动态规划：简单 DP、背包 DP、区间 DP、树形 DP、数位 DP
- 数学：数论基础
- 字符串：字符串基础

顶部导航栏显示这些大类，左侧导航栏只显示当前大类下的小类页面。后续你只需要继续修改 `docs/algorithm-templates/` 目录下的 Markdown 文件即可。



## 最近更新

- 动态规划栏目已扩写为讲解型页面，包含公式、图示、复杂度和常见易错点。
- 入口：[动态规划总览](algorithm-templates/dynamic-programming.md)
