---
tags:
  - yyn
  - 算法模板
---

# 区间DP
**算法介绍：**
区间DP是指状态表示为区间[l,r]的动态规划，通常用于处理区间上的最优解问题。

**应用场景：**
- 石子合并
- 回文子串
- 括号匹配
- 矩阵链乘法
- 合法括号字符串消除问题

### 区间DP模板

```python
'''
对于类似合法括号字符串（RBS）的消除问题，通常根据题意，会有如下性质：
可以消除相邻的匹配字符。
相邻匹配字符消除后，原本不相邻的字符会变成相邻，可以继续消除。换句话说，设子串 A=x+B+y，如果 x 和 y 是匹配的（可以消除），且子串 B 可以完全消除，那么子串 A 可以完全消除。
设子串 A=B+C，如果子串 B 和 C 可以完全消除，那么子串 A 可以完全消除。
满足上述性质的题目，可以用区间 DP 解决。

定义 f(i,j) 表示消除 s[i] 到 s[j] 的最优值。

根据性质 2，可以把 f(i,j) 缩小成子问题 f(i+1,j−1)。
根据性质 3，可以枚举子串 B 的右端点，即枚举 k=i+1,i+3,i+5,…,j−2，把 f(i,j) 划分成子问题 f(i,k) 和 f(k+1,j)。注意这里枚举 k 的步长是 2，因为每次消除 2 个字符，被消除的子串长度一定是偶数。
边界：f(i+1,i)，即空串。

答案：f(0,n−1)。
'''

from functools import lru_cache

inf = float('inf')


def func1():
    """记忆化搜索解法"""
    n = 10

    @lru_cache(None)
    def dfs(l, r):
        if l == r:
            return 0  # 根据题意修改
        res = inf  # 根据题意修改
        for k in range(l, r):
            tar = 0  # 根据题意修改
            res = min(res, dfs(l, k) + dfs(k + 1, r) + tar)
        return res

    print(dfs(0, n - 1))


def func2():
    """记忆化搜索转递推"""
    n = 10
    # 初始值根据题意修改
    f = [[inf] * n for i in range(n)]
    for i in range(n):
        f[i][i] = 0

    for l in range(n - 1, -1, -1):
        for r in range(l + 1, n):
            for k in range(l, r):
                tar = 0  # 根据题意修改
                f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r] + tar)

    print(f[0][n - 1])
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

