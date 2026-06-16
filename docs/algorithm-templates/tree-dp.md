# 树形 DP

树形 DP 是把动态规划放到树结构上做。与线性 DP 不同，树形 DP 的状态通常定义在节点或子树上。

树形 DP 的核心是：**一个节点的答案通常由它的若干子节点答案合并得到**。

## 树形 DP 的基本形式

如果把树以某个节点为根，那么常见状态可以写成：

$$
f[x] = \text{以 } x \text{ 为根的子树中的答案}
$$

因为父节点依赖子节点，所以通常需要后序处理：先处理所有儿子，再回到父节点。

递归 DFS 的基本框架是：

```python
def dfs(fa, x):
    for y in g[x]:
        if y != fa:
            child_state = dfs(x, y)
            # 用 child_state 更新 x 的状态
```

## 递归求解：树的直径

### 原理说明

树的直径是树上任意两点之间的最长简单路径。

如果一条最长路径经过节点 `x`，那么它可能由 `x` 的两条最长向下路径拼成：

$$
ans = \max(ans, longest_1(x)+longest_2(x))
$$

模板中的 `mx` 表示当前已经见过的最大子树长度，`l` 表示从当前节点走向某个子节点方向能得到的长度。每次遇到一条新的子树路径，就用 `mx + l` 尝试更新答案。

### 代码模板

```python
# 求解树的直径
# 对每个节点维护最大和次大子树长度
def main():
    n = int(input())
    g = [[] for i in range(n)]
    for i in range(n - 1):
        u, v = map(int, input().split())
        u, v = u - 1, v - 1  # 转换为0-indexed
        g[u].append(v)
        g[v].append(u)

    ans = 0

    def dfs(fa, x):
        """DFS求解树的直径"""
        nonlocal ans
        mx = 0  # 当前节点的最大子树长度
        for y in g[x]:
            if y != fa:
                l = dfs(x, y) + 1  # 子树长度
                ans = max(ans, mx + l)  # 更新答案：经过当前节点的路径
                mx = max(mx, l)  # 更新最大子树长度
        return mx

    dfs(-1, 0)  # 从根节点开始
    print("树的直径:", ans)

# 示例使用（需要手动输入数据）
# main()
```

## 递推求解：树的直径

### 原理说明

递推写法的思想是先构造一个遍历顺序，再反向处理节点。反向处理时，子节点会先于父节点更新，因此可以把子节点的最长下行链贡献给父节点。

模板中：

- `dp[i][1]` 表示节点 `i` 当前维护的最长下行链；
- `dp[i][0]` 表示节点 `i` 当前维护的次长下行链；
- 对每个节点，最长链和次长链相加，就可以得到一条经过该节点的候选直径。

### 代码模板

```python
# 求解树的直径
# 对每个节点维护最大和次大子树长度
def main():
    n = int(input())
    g = [[] for i in range(n)]
    for i in range(n - 1):
        u, v = map(int, input().split())
        u, v = u - 1, v - 1  # 转换为0-indexed
        g[u].append(v)
        g[v].append(u)

    # BFS构建拓扑序
    stk = [1]
    order = []
    pa = [i for i in range(n + 1)]
    while stk:
        u = stk.pop()
        order.append(u)
        for v in g[u]:
            if pa[u] != v:
                pa[v] = u
                stk.append(v)

    # dp[i][0]表示次大值，dp[i][1]表示最大值
    dp = [[0] * 2 for i in range(n + 1)]
    for u in reversed(order[1:]):  # 从叶子节点开始递推
        v = pa[u]
        dp[u][1] += 1
        if dp[v][1] < dp[u][1]:
            dp[v][1], dp[v][0] = dp[u][1], dp[v][1]
        else:
            if dp[v][0] < dp[u][1]:
                dp[v][0] = dp[u][1]
    dp[1][1] += 1
    
    ans = 0
    for i in range(1, n + 1):
        ans = max(ans, sum(dp[i]) - 1)
    print("树的直径:", ans)

# 示例使用（需要手动输入数据）
# main()
```

## 易错点

- 树形 DP 通常要记录父节点，避免从儿子又走回父亲。
- 递归写法在深树中可能爆栈，必要时可以改成迭代。
- 直径问题中，经过某个点的最长路径通常来自两条不同子树方向，不能用同一条链重复计算。
- 如果节点编号从 0 开始或 1 开始，数组大小和初始根节点要保持一致。
