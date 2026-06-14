---
tags:
  - yyn
  - 算法模板
  - 动态规划
---

# 区间 DP

区间 DP 的状态通常定义在一个连续区间上，例如：

\[
f[l][r]
\]

它表示区间 \([l,r]\) 的最优值、方案数或可行性。区间 DP 常用于“把一个区间拆成两个子区间”或者“先处理内部，再处理两端”的问题。

## 经典例题：石子合并

!!! example "例题：石子合并"
    有 \(n\) 堆石子排成一行，第 \(i\) 堆有 \(a_i\) 个石子。每次可以合并相邻的两堆，代价为这两堆石子的总数。经过 \(n-1\) 次合并后，所有石子合成一堆，求最小总代价。

这个问题的特点是：最后一次合并一定是把某个区间 \([l,r]\) 分成左右两部分，先分别合并成两堆，再把这两堆合并。

## 状态设计

设：

\[
f[l][r] = \text{将区间 } [l,r] \text{ 内所有石子合并成一堆的最小代价}
\]

如果最后一次合并时，断点为 \(k\)，那么先把 \([l,k]\) 合并成一堆，再把 \([k+1,r]\) 合并成一堆，最后合并这两堆。

\[
f[l][r]=\min_{l\le k<r}\{f[l][k]+f[k+1][r]+sum(l,r)\}
\]

其中：

\[
sum(l,r)=a_l+a_{l+1}+\cdots+a_r
\]

为了快速计算区间和，通常预处理前缀和：

\[
sum(l,r)=pre[r+1]-pre[l]
\]

边界为：

\[
f[i][i]=0
\]

因为只有一堆石子时不需要合并。

<figure class="algo-figure" markdown>
![区间 DP 拆分示意图](../assets/images/dp/interval-dp-split.svg)
<figcaption>图 1：区间 DP 常通过枚举断点，把大区间拆成两个已经计算的小区间。</figcaption>
</figure>

## 枚举顺序

计算 \(f[l][r]\) 时，需要用到更短的区间，例如 \(f[l][k]\) 和 \(f[k+1][r]\)。因此必须按区间长度从小到大枚举。

常见顺序是：

1. 枚举区间长度 `length`；
2. 枚举左端点 `l`；
3. 算出右端点 `r`；
4. 枚举断点 `k`。

## 模板代码：石子合并

```python
# 石子合并：线性版本，求最小合并代价

a = [4, 5, 9, 4]
n = len(a)
INF = float('inf')

# 前缀和，sum(l, r) = pre[r + 1] - pre[l]
pre = [0]
for x in a:
    pre.append(pre[-1] + x)

def range_sum(l, r):
    return pre[r + 1] - pre[l]

# f[l][r] 表示合并区间 [l, r] 的最小代价
f = [[0] * n for _ in range(n)]

for length in range(2, n + 1):
    for l in range(0, n - length + 1):
        r = l + length - 1
        f[l][r] = INF
        for k in range(l, r):
            f[l][r] = min(
                f[l][r],
                f[l][k] + f[k + 1][r] + range_sum(l, r)
            )

print(f[0][n - 1])
```

## 通用区间 DP 模板

如果一个题目可以枚举断点合并左右区间，通常可以套下面的结构：

```python
n = 10
INF = float('inf')
f = [[0] * n for _ in range(n)]

for length in range(2, n + 1):
    for l in range(0, n - length + 1):
        r = l + length - 1
        f[l][r] = INF
        for k in range(l, r):
            cost = 0  # 根据题目修改
            f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r] + cost)

print(f[0][n - 1])
```

如果题目要求最大值，只需要把初始值和 `min` 改成对应的最大化形式。

## 记忆化搜索写法

区间 DP 的递归形式更接近状态定义，适合先想清楚转移：

```python
from functools import lru_cache

INF = float('inf')
a = [4, 5, 9, 4]
n = len(a)
pre = [0]
for x in a:
    pre.append(pre[-1] + x)

def range_sum(l, r):
    return pre[r + 1] - pre[l]

@lru_cache(None)
def dfs(l, r):
    if l == r:
        return 0
    res = INF
    for k in range(l, r):
        res = min(res, dfs(l, k) + dfs(k + 1, r) + range_sum(l, r))
    return res

print(dfs(0, n - 1))
```

## 区间消除类问题

有些区间 DP 不只是枚举断点，还会考虑两端是否能配对。例如括号匹配、回文子序列、字符串消除等问题。

如果两端可以配对，可能有：

\[
f[l][r] \leftarrow f[l+1][r-1]
\]

如果区间可以拆成两段分别处理，可能有：

\[
f[l][r] \leftarrow f[l][k] \land f[k+1][r]
\]

这类问题的共性是：计算大区间前，必须保证小区间已经处理完。

## 易错点

!!! warning "区间 DP 常见错误"
    - 忘记初始化 \(f[i][i]\)。
    - 区间长度从大到小枚举，导致依赖状态还没算出。
    - 前缀和下标和区间下标混用。
    - 断点范围写错。通常是 `for k in range(l, r)`，表示拆成 `[l, k]` 和 `[k+1, r]`。
