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
