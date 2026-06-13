---
tags:
  - yyn
  - 算法模板
---

# 树形DP
**算法介绍：**
树形动态规划是在树形结构上进行动态规划的技术，通常通过DFS或递推的方式在树上进行状态转移。

**应用场景：**
- 树的直径计算
- 树上路径统计
- 树的最优解问题
- 树的连通性问题

### 递归求解

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

### 递推求解

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

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

