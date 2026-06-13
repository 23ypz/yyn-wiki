---
tags:
  - yyn
  - 算法模板
---

# 简单DP
**算法介绍：**
简单动态规划是指一些基础的DP问题，通常具有明显的状态转移关系和相对简单的状态定义。

**应用场景：**
- 序列问题
- 路径计数
- 最优化问题
- 状态转移问题

### 最长上升子序列LIS

```python
from bisect import bisect_left

n = 6
a = [1, 4, 2, 2, 5, 6]

# nlogn 解法 - 贪心 + 二分
g = []
for i, x in enumerate(a):
    idx = bisect_left(g, x)  # 找到第一个>=x的位置
    if idx == len(g):
        g.append(x)  # 扩展序列
    else:
        g[idx] = x  # 替换为更小的值

print("nlogn解法结果:", len(g))

# n^2 解法 - 经典DP
a = [0] + a  # 下标从1开始
dp = [0] + [1] * n  # dp[i]表示以a[i]结尾的最长上升子序列长度
for i in range(1, n + 1):
    for j in range(1, i):
        if a[j] < a[i]:
            dp[i] = max(dp[i], dp[j] + 1)
print("n^2解法结果:", max(dp))
```

### 最长公共子序列LCS

```python
n, m = 5, 6
a = [1, 2, 3, 4, 5]
b = [2, 3, 2, 1, 4, 5]

from functools import lru_cache

# 记忆化搜索
@lru_cache(None)
def dfs(i, j):
    """求a[0..i]和b[0..j]的最长公共子序列长度"""
    if i < 0 or j < 0:
        return 0
    # 如果这两个元素一样，那就选，长度+1
    if a[i] == b[j]:
        return dfs(i - 1, j - 1) + 1
    else:
        # 选其中一个：跳过a[i]或跳过b[j]
        return max(dfs(i - 1, j), dfs(i, j - 1))

# 二维DP
dp = [[0] * (m + 1) for i in range(n + 1)]
for i in range(n):
    for j in range(m):
        if a[i] == b[j]:
            dp[i + 1][j + 1] = dp[i][j] + 1
        else:
            dp[i + 1][j + 1] = max(dp[i][j + 1], dp[i + 1][j])

print("记忆化搜索结果:", dfs(n - 1, m - 1))
print("二维DP结果:", dp[-1][-1])
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

