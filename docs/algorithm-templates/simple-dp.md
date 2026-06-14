---
tags:
  - yyn
  - 算法模板
  - 动态规划
---

# 简单 DP

简单 DP 通常指状态维度较低、转移关系比较直接的一类动态规划。常见形式是“处理到第几个位置”或“处理两个序列的前缀”。这类问题适合先用清晰的状态定义写出转移，再考虑是否可以用贪心、二分或滚动数组优化。

!!! note "本页目标"
    通过两个经典例题理解线性 DP：最长上升子序列 LIS 和最长公共子序列 LCS。

## 最长上升子序列 LIS

### 经典例题

!!! example "例题：最长上升子序列"
    给定一个长度为 \(n\) 的序列 \(a_1,a_2,\ldots,a_n\)，从中选出若干个元素，要求它们在原序列中的相对顺序不变，且数值严格递增。求能选出的最长长度。

    例如序列 `[1, 4, 2, 2, 5, 6]` 中，一个最长上升子序列是 `[1, 2, 5, 6]`，答案为 `4`。

LIS 是最典型的线性 DP 之一。它的关键是把“整个序列的答案”拆成“以某个位置结尾的答案”。

### 状态设计

设：

\[
f[i] = \text{以 } a_i \text{ 结尾的最长上升子序列长度}
\]

如果 \(j<i\) 且 \(a_j<a_i\)，那么可以把 \(a_i\) 接在以 \(a_j\) 结尾的上升子序列后面，因此有：

\[
f[i] = \max_{j<i,\ a_j<a_i}(f[j]+1)
\]

边界为：

\[
f[i]=1
\]

因为只选 \(a_i\) 自己也能形成长度为 \(1\) 的上升子序列。

最终答案不是某一个固定的 \(f[n]\)，而是：

\[
\max_{1\le i\le n} f[i]
\]

### 模板代码：经典 DP 写法

```python
n = 6
a = [1, 4, 2, 2, 5, 6]

# 下标从 1 开始更方便写状态
arr = [0] + a
f = [0] + [1] * n

for i in range(1, n + 1):
    for j in range(1, i):
        if arr[j] < arr[i]:
            f[i] = max(f[i], f[j] + 1)

print(max(f))  # 4
```

复杂度为 \(O(n^2)\)，适合 \(n\) 不太大的情况。

### 贪心加二分优化

LIS 还可以用贪心加二分优化到 \(O(n\log n)\)。维护数组 `g`：

\[
g[k] = \text{长度为 } k+1 \text{ 的上升子序列的最小结尾值}
\]

结尾值越小，越容易接上后面的数。所以遇到新数 \(x\) 时，用二分找到 `g` 中第一个大于等于 \(x\) 的位置并替换它。

下面用手动轮播图演示序列 `[1, 4, 2, 2, 5, 6]` 的处理过程。注意 `g` 不一定是真实子序列，它只记录每种长度下最优的最小结尾。

<div class="yyn-carousel" tabindex="0" aria-label="LIS 贪心加二分过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：g 为空，直接追加 1。"><img src="../../assets/images/dp/lis-step-1.svg" alt="LIS 第 1 步：追加 1"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：4 大于所有结尾，追加到 g 末尾。"><img src="../../assets/images/dp/lis-step-2.svg" alt="LIS 第 2 步：追加 4"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：用 2 替换原来的 4，使长度为 2 的子序列结尾更小。"><img src="../../assets/images/dp/lis-step-3.svg" alt="LIS 第 3 步：用 2 替换 4"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：再次遇到 2，替换后 g 不变。"><img src="../../assets/images/dp/lis-step-4.svg" alt="LIS 第 4 步：g 不变"></div>
    <div class="yyn-carousel-slide" data-caption="第 5 步：5 大于所有结尾，追加到 g 末尾。"><img src="../../assets/images/dp/lis-step-5.svg" alt="LIS 第 5 步：追加 5"></div>
    <div class="yyn-carousel-slide" data-caption="第 6 步：6 继续扩展，最终 LIS 长度为 4。"><img src="../../assets/images/dp/lis-step-6.svg" alt="LIS 第 6 步：追加 6"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 6</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：g 为空，直接追加 1。</div>
</div>

### 模板代码：贪心加二分写法

```python
from bisect import bisect_left

n = 6
a = [1, 4, 2, 2, 5, 6]

# g[k] 表示长度为 k+1 的上升子序列的最小结尾值
g = []
for x in a:
    idx = bisect_left(g, x)  # 严格上升：找第一个 >= x 的位置
    if idx == len(g):
        g.append(x)
    else:
        g[idx] = x

print(len(g))  # 4
```

!!! tip "严格上升与非严格上升"
    - 严格上升：使用 `bisect_left`，替换第一个 `>= x` 的位置。
    - 非严格上升：使用 `bisect_right`，替换第一个 `> x` 的位置。

## 最长公共子序列 LCS

### 经典例题

!!! example "例题：最长公共子序列"
    给定两个序列 \(A\) 和 \(B\)，求它们的最长公共子序列长度。子序列不要求连续，但相对顺序不能改变。

    例如：

    ```text
    A = [1, 2, 3, 4, 5]
    B = [2, 3, 2, 1, 4, 5]
    ```

    一个最长公共子序列可以是 `[2, 3, 4, 5]`，答案为 `4`。

LCS 的关键是把两个序列的前缀作为状态。它和 LIS 一样是序列 DP，但状态中需要同时描述两个序列的位置。

### 状态设计

设：

\[
f[i][j] = \text{序列 } A \text{ 的前 } i \text{ 个元素和序列 } B \text{ 的前 } j \text{ 个元素的 LCS 长度}
\]

如果 \(A_i=B_j\)，那么这两个元素可以一起选入公共子序列：

\[
f[i][j]=f[i-1][j-1]+1
\]

如果 \(A_i\ne B_j\)，那么最后一个元素至少有一个不选：

\[
f[i][j]=\max(f[i-1][j], f[i][j-1])
\]

### 模板代码：记忆化搜索

```python
from functools import lru_cache

n, m = 5, 6
a = [1, 2, 3, 4, 5]
b = [2, 3, 2, 1, 4, 5]

@lru_cache(None)
def dfs(i, j):
    """求 a[0..i] 和 b[0..j] 的最长公共子序列长度。"""
    if i < 0 or j < 0:
        return 0
    if a[i] == b[j]:
        return dfs(i - 1, j - 1) + 1
    return max(dfs(i - 1, j), dfs(i, j - 1))

print(dfs(n - 1, m - 1))  # 4
```

### 模板代码：二维 DP

```python
n, m = 5, 6
a = [1, 2, 3, 4, 5]
b = [2, 3, 2, 1, 4, 5]

dp = [[0] * (m + 1) for _ in range(n + 1)]

for i in range(n):
    for j in range(m):
        if a[i] == b[j]:
            dp[i + 1][j + 1] = dp[i][j] + 1
        else:
            dp[i + 1][j + 1] = max(dp[i][j + 1], dp[i + 1][j])

print(dp[n][m])  # 4
```

复杂度为 \(O(nm)\)，空间复杂度为 \(O(nm)\)。如果只需要长度，可以继续用滚动数组把空间降到 \(O(m)\)。

## 小结

简单 DP 的核心是先确定“状态表示的子问题”。LIS 使用“以某个位置结尾”的状态，LCS 使用“两个前缀”的状态。状态定义清楚后，转移通常来自“最后一步选不选、接不接、匹不匹配”。
