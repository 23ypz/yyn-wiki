# 简单 DP

简单 DP 通常指状态维度较低、转移关系比较直接的一类动态规划。常见形式是“处理到第几个位置”或“处理两个序列的前缀”。这类问题适合先写出清晰的状态定义，再考虑是否可以用记忆化搜索、滚动数组、贪心或二分优化。

## 最长上升子序列 LIS

### 经典例题

!!! example "例题：最长上升子序列"
    给定一个长度为 $n$ 的序列 $a_1,a_2,\ldots,a_n$，从中选出若干个元素，要求它们在原序列中的相对顺序不变，并且数值严格递增。求最长能选多少个元素。

LIS 可以先用经典 DP 理解，再用贪心加二分优化。

经典 DP 的状态是：

$$
f[i] = \text{以 } a_i \text{ 结尾的最长上升子序列长度}
$$

如果 $j<i$ 且 $a_j<a_i$，那么 $a_i$ 可以接在以 $a_j$ 结尾的上升子序列后面：

$$
f[i] = \max(f[i], f[j]+1)
$$

贪心加二分写法维护数组 `g`：

$$
g[k] = \text{长度为 } k+1 \text{ 的上升子序列的最小结尾值}
$$

结尾越小，后面越容易继续接数，所以每次用二分找到第一个大于等于当前数的位置并替换。

### 代码模板

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

### 易错点

- 严格上升用 `bisect_left`，表示替换第一个 `>= x` 的位置。
- 如果要求非严格上升，通常要改成 `bisect_right`。
- `g` 数组不一定是真实子序列，它记录的是每种长度下最优的最小结尾。
- 二次复杂度 DP 的答案是 `max(dp)`，不一定是 `dp[n]`。

## 最长公共子序列 LCS

### 经典例题

!!! example "例题：最长公共子序列"
    给定两个序列 $A$ 和 $B$，求它们的最长公共子序列长度。子序列不要求连续，但相对顺序不能改变。

LCS 的状态一般定义在两个前缀上：

$$
dp[i][j] = \text{序列 } A \text{ 的前 } i \text{ 个元素和 } B \text{ 的前 } j \text{ 个元素的 LCS 长度}
$$

如果当前两个元素相等，就可以把它们一起放入公共子序列：

$$
dp[i+1][j+1] = dp[i][j] + 1
$$

如果不相等，就只能跳过其中一个：

$$
dp[i+1][j+1] = \max(dp[i][j+1], dp[i+1][j])
$$

### 代码模板

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

### 易错点

- `dp` 多开一行一列，可以自然处理空前缀。
- 记忆化搜索里的 `dfs(i,j)` 是处理 `a[0..i]` 和 `b[0..j]`。
- 二维 DP 里的 `dp[i+1][j+1]` 对应原数组中的 `a[i]` 和 `b[j]`。
