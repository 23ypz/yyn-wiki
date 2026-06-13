---
tags:
  - yyn
  - 算法模板
---

# 背包DP
**算法介绍：**
背包问题是动态规划中的经典问题，描述的是在给定容量的背包中选择物品，使得总价值最大。包括01背包、完全背包、多重背包等变种。

**应用场景：**
- 资源分配问题
- 投资组合优化
- 物品选择问题
- 容量限制问题

### 01背包

```python
n, m = 5, 20  # n:物品数量, m:背包容量
g = [(1, 6), (2, 5), (3, 8), (5, 15), (3, 3)]  # (重量, 价值)

from functools import lru_cache

# 解法一: 记忆化搜索
@lru_cache(None)
def dfs(i, c):
    if i < 0:
        return 0 if c <= m else float('-inf')
    if m - c < g[i][0]:
        return dfs(i - 1, c)  # 不选当前物品
    else:
        return max(dfs(i - 1, c), dfs(i - 1, c + g[i][0]) + g[i][1])

print("记忆化搜索结果:", dfs(n - 1, 0))

# 解法二: 二维DP
f = [[0] * (m + 1) for i in range(n + 1)]
for i in range(1, n + 1):
    w, v = g[i - 1]
    f[i] = f[i - 1][::]  # 复制上一行
    for j in range(m + 1):
        if j - w >= 0:
            f[i][j] = max(f[i - 1][j], f[i - 1][j - w] + v)

print("二维DP结果:", max(f[-1]))

# 解法三: 一维DP（空间优化）
dp = [0] * (m + 1)
for i in range(n):
    w, v = g[i]
    # 逆序遍历，避免重复使用
    for j in range(m, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)

print("一维DP结果:", dp[-1])
```

### 完全背包

```python
n, m = 5, 20  # n:物品数量, m:背包容量
g = [(1, 6), (2, 5), (3, 8), (5, 15), (3, 3)]  # (重量, 价值)

from functools import lru_cache

# 解法一: 记忆化搜索
@lru_cache(None)
def dfs(i, c):
    if i < 0:
        return 0 if c <= m else float('-inf')
    # 完全背包：选当前物品后，仍可以选当前物品（i不变），而不是i-1
    res = dfs(i - 1, c)  # 不选当前物品
    if m - c >= g[i][0]:
        res = max(res, dfs(i, c + g[i][0]) + g[i][1])  # 选当前物品，i不变
    return res

print("记忆化搜索结果:", dfs(n - 1, 0))

# 解法二: 二维DP
f = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    w, v = g[i - 1]
    f[i] = f[i - 1][::]  # 先复制不选当前物品的情况
    for j in range(m + 1):
        # 完全背包：j >= w时，可从f[i][j-w]转移（允许重复选当前物品）
        if j - w >= 0:
            f[i][j] = max(f[i][j], f[i][j - w] + v)  # 关键：f[i]而非f[i-1]

print("二维DP结果:", max(f[-1]))

# 解法三: 一维DP（空间优化）
dp = [0] * (m + 1)
for i in range(n):
    w, v = g[i]
    # 完全背包核心：正序遍历容量（j从w到m），允许重复选取当前物品
    for j in range(w, m + 1):
        dp[j] = max(dp[j], dp[j - w] + v)

print("一维DP结果:", dp[-1])
```

### 多重背包

```python
n, m = 3, 30  # n:物品数量, m:背包容量
# 物品：(重量w, 价值v, 数量s)
g = [(1, 2, 3), (4, 5, 6), (7, 8, 9)]

from functools import lru_cache

# 解法一: 记忆化搜索
@lru_cache(None)
def dfs(i, c, cnt):
    """
    i: 当前处理到第i个物品（从0开始）
    c: 已使用的容量
    cnt: 当前物品已选的数量
    """
    if i < 0:
        return 0 if c <= m else float('-inf')
    # 不选当前物品，直接处理下一个
    res = dfs(i - 1, c, 0)
    w, v, s = g[i]
    # 选当前物品：需满足容量足够，且未超过数量限制
    if m - c >= w and cnt < s:
        res = max(res, dfs(i, c + w, cnt + 1) + v)
    return res

print("记忆化搜索结果:", dfs(n - 1, 0, 0))

# 解法二: 二维DP
f = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    w, v, s = g[i - 1]
    f[i] = f[i - 1][::]  # 先复制不选当前物品的情况
    # 遍历容量
    for j in range(m + 1):
        # 遍历当前物品的选取次数（1~s次）
        for k in range(1, s + 1):
            if j >= w * k:
                f[i][j] = max(f[i][j], f[i - 1][j - w * k] + v * k)

print("二维DP结果:", max(f[-1]))

# 解法三: 一维DP
dp = [0] * (m + 1)
for i in range(n):
    w, v, s = g[i]
    # 多重背包：逆序遍历容量（避免重复选），同时限制选取次数
    for j in range(m, w - 1, -1):
        # 尝试选1~s次当前物品
        for k in range(1, s + 1):
            if j >= w * k:
                dp[j] = max(dp[j], dp[j - w * k] + v * k)

print("一维DP结果:", dp[-1])

# 解法四: 一维DP + 二进制优化
nums = []
for i in range(n):
    w, v, s = g[i]
    k = 1
    while s >= k:
        nums.append((k * w, k * v))
        s -= k
        k *= 2
    if s != 0:
        nums.append((s * w, v * s))

dp = [0] * (m + 1)
for i, (w, v) in enumerate(nums, 1):
    for j in range(m, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)
print("二进制优化结果:", dp[m])
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

