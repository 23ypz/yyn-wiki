---
tags:
  - yyn
  - 算法模板
  - 动态规划
---

# 树形 DP

树形 DP 是在树结构上进行的动态规划。由于树没有环，一个节点的子树之间天然相互独立，因此很多问题可以先计算子节点，再把信息合并到父节点。

## 基本思想

树形 DP 通常以某个节点 \(u\) 为根，定义：

\[
f[u] = \text{以 } u \text{ 为根的子树中的答案}
\]

如果状态还需要区分选择情况，可以写成：

\[
f[u][0],\ f[u][1]
\]

例如：

- \(f[u][0]\)：不选节点 \(u\) 时，子树的最优值；
- \(f[u][1]\)：选节点 \(u\) 时，子树的最优值。

<figure class="algo-figure" markdown>
![树形 DP 子树合并示意图](../assets/images/dp/tree-dp-merge.svg)
<figcaption>图 1：树形 DP 常在 DFS 回溯阶段把孩子的状态合并到父节点。</figcaption>
</figure>

## 例：没有上司的舞会模型

给定一棵树，每个点有权值 \(val[u]\)。选择一些点，使得任意父子节点不能同时被选，求最大权值和。

状态定义：

\[
f[u][0] = \text{不选 } u \text{ 时，} u \text{ 子树内的最大权值和}
\]

\[
f[u][1] = \text{选 } u \text{ 时，} u \text{ 子树内的最大权值和}
\]

转移：

如果选 \(u\)，孩子都不能选：

\[
f[u][1] = val[u] + \sum_{v\in son(u)} f[v][0]
\]

如果不选 \(u\)，每个孩子可选可不选，取较大值：

\[
f[u][0] = \sum_{v\in son(u)} \max(f[v][0], f[v][1])
\]

代码：

```python
n = 5
val = [0, 3, 2, 1, 10, 1]  # 节点权值，1-indexed
edges = [(1, 2), (1, 3), (2, 4), (2, 5)]

g = [[] for _ in range(n + 1)]
for u, v in edges:
    g[u].append(v)
    g[v].append(u)

f = [[0, 0] for _ in range(n + 1)]

def dfs(u, fa):
    f[u][1] = val[u]
    for v in g[u]:
        if v == fa:
            continue
        dfs(v, u)
        f[u][0] += max(f[v][0], f[v][1])
        f[u][1] += f[v][0]

dfs(1, 0)
print(max(f[1][0], f[1][1]))
```

## 递归求解与递推求解

### 递归写法

递归写法直观，适合竞赛中大多数树形 DP：

```python
def dfs(u, fa):
    # 初始化 f[u]
    for v in g[u]:
        if v == fa:
            continue
        dfs(v, u)
        # 用 f[v] 更新 f[u]
```

### 非递归写法

如果递归深度可能过大，可以先得到遍历顺序，再逆序处理：

```python
parent = [0] * (n + 1)
order = [1]
parent[1] = -1

for u in order:
    for v in g[u]:
        if v == parent[u]:
            continue
        parent[v] = u
        order.append(v)

# 逆序时，孩子一定先于父节点被处理
for u in reversed(order):
    # 合并 u 的所有孩子
    pass
```

## 背包型树形 DP

如果状态带有“选了多少个点”这类容量维度，常写成：

\[
f[u][k] = \text{在 } u \text{ 子树内选 } k \text{ 个点的最优值}
\]

合并孩子时类似分组背包：

\[
f[u][i+j] = \max(f[u][i+j], f[u][i] + f[v][j])
\]

这类问题的复杂度通常与子树大小和容量有关。

## 复杂度

普通树形 DP 每条边只被 DFS 访问常数次，因此：

\[
\text{时间复杂度}=O(n),\qquad \text{空间复杂度}=O(n)
\]

如果有容量维度，例如 \(f[u][k]\)，复杂度通常会上升到 \(O(nK^2)\) 或通过优化降到 \(O(nK)\)，要根据合并方式判断。

## 易错点

!!! warning "常见错误"
    - 无向树 DFS 时忘记传父节点，导致死循环。
    - 初始化状态的位置错误。
    - 合并多个孩子时，没有使用临时数组，导致同一个孩子被重复合并。
    - 树根选择不影响答案的问题，不要误把根限制成特殊状态。
