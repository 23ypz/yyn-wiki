---
tags:
  - yyn
  - 算法模板
---

# 最近公共祖先
**算法介绍：**
最近公共祖先（Lowest Common Ancestor，LCA）是指在有根树中，两个节点的最近的共同祖先节点。常用的算法有倍增法、Tarjan算法等。

**应用场景：**
- 树上距离计算
- 树上路径查询
- 树的动态操作
- 生物信息学

### LCA查询

```python
n = 5
grid = [(1, 2), (1, 3), (2, 4), (2, 5)]
question = [(4, 5), (3, 4), (3, 5)]
# 节点编号从 1 开始
g = [[] for i in range(n + 1)]
for u, v in grid:
    g[u].append(v)
    g[v].append(u)

dep = [0] * (n + 1)  # 深度数组
mx = 20  # 最大深度
pa = [[0] * (mx + 1) for i in range(n + 1)]  # 祖先数组

def dfs(fa, x):
    """DFS预处理深度和祖先"""
    dep[x] = dep[fa] + 1
    pa[x][0] = fa
    for i in range(1, mx):
        pa[x][i] = pa[pa[x][i - 1]][i - 1]
    for y in g[x]:
        if y != fa:
            dfs(x, y)

dfs(0, 1)

def lca(x, y):
    """求x和y的最近公共祖先"""
    if dep[x] < dep[y]:
        x, y = y, x
    # 先跳到同一个深度
    for i in range(mx, -1, -1):
        if dep[pa[x][i]] >= dep[y]:
            x = pa[x][i]
    # 如果已经相等就返回
    if x == y:
        return x
    # 否则就一起往上跳，直到它们的父节点相同
    for i in range(mx, -1, -1):
        if pa[x][i] != pa[y][i]:
            x, y = pa[x][i], pa[y][i]
    return pa[x][0]

# 示例查询
for x, y in question:
    print(f"LCA({x}, {y}) = {lca(x, y)}")
```

### 带权树LCA

```python
class LcaBinaryLifting:
    """带权树的LCA实现，支持查询距离"""
    def __init__(self, edges):
        n = len(edges) + 1
        m = n.bit_length()
        g = [[] for _ in range(n)]
        for x, y, w in edges:
            # 如果题目的节点编号从 1 开始，改成 x-1 和 y-1
            g[x].append((y, w))
            g[y].append((x, w))

        depth = [0] * n
        dis = [0] * n  # 如果是无权树（边权为 1），dis 可以去掉，用 depth 代替
        pa = [[-1] * n for _ in range(m)]

        def dfs(x: int, fa: int) -> None:
            """DFS预处理深度、距离和祖先"""
            pa[0][x] = fa
            for y, w in g[x]:
                if y != fa:
                    depth[y] = depth[x] + 1
                    dis[y] = dis[x] + w
                    dfs(y, x)

        dfs(0, -1)

        # 倍增预处理祖先
        for i in range(m - 1):
            for x in range(n):
                if (p := pa[i][x]) != -1:
                    pa[i + 1][x] = pa[i][p]

        self.depth = depth
        self.dis = dis
        self.pa = pa

    # 返回 node 的第 k 个祖先节点
    # 如果不存在，返回 -1
    def get_kth_ancestor(self, node: int, k: int) -> int:
        """获取节点的第k个祖先"""
        pa = self.pa
        for i in range(k.bit_length()):
            if k >> i & 1:
                node = pa[i][node]
                if node < 0:
                    return -1
        return node

    # 返回 x 和 y 的最近公共祖先
    def get_lca(self, x: int, y: int) -> int:
        """获取两个节点的LCA"""
        if self.depth[x] > self.depth[y]:
            x, y = y, x
        # 使 y 和 x 在同一深度
        y = self.get_kth_ancestor(y, self.depth[y] - self.depth[x])
        if y == x:
            return x
        pa = self.pa
        for i in range(len(pa) - 1, -1, -1):
            px, py = pa[i][x], pa[i][y]
            if px != py:
                x, y = px, py  # 同时往上跳 2**i 步
        return pa[0][x]

    # 返回 x 到 y 的距离（最短路长度）
    def get_dis(self, x: int, y: int) -> int:
        """获取两个节点之间的距离"""
        return self.dis[x] + self.dis[y] - self.dis[self.get_lca(x, y)] * 2

# 示例使用
edges = [(0, 1, 2), (1, 2, 3), (1, 3, 4), (3, 4, 5)]  # (u, v, w)
lca = LcaBinaryLifting(edges)
print("LCA(2, 4):", lca.get_lca(2, 4))
print("距离(2, 4):", lca.get_dis(2, 4))
```

### 树上差分

```python
n = 5
grid = [(1, 2), (2, 3), (3, 4), (4, 5)]
options = [(1, 3, 5), (3, 4, 7), (3, 5, 3)]
# 节点编号从 1 开始
g = [[] for i in range(n + 1)]
for u, v in grid:
    g[u].append(v)
    g[v].append(u)

dep = [0] * (n + 1)
mx = 20
pa = [[0] * (mx + 1) for i in range(n + 1)]

def dfs(fa, x):
    """DFS预处理深度和祖先"""
    dep[x] = dep[fa] + 1
    pa[x][0] = fa
    for i in range(1, mx):
        pa[x][i] = pa[pa[x][i - 1]][i - 1]
    for y in g[x]:
        if y != fa:
            dfs(x, y)

dfs(0, 1)  # 从根节点开始

def lca(x, y):
    """求两个节点的LCA"""
    if dep[x] < dep[y]:
        x, y = y, x
    # 先跳到同一个深度
    for i in range(mx, -1, -1):
        if dep[pa[x][i]] >= dep[y]:
            x = pa[x][i]
    # 如果已经相等就返回
    if x == y:
        return x
    # 否则就一起往上跳
    for i in range(mx, -1, -1):
        if pa[x][i] != pa[y][i]:
            x, y = pa[x][i], pa[y][i]
    return pa[x][0]

# 树上差分：对路径上的点进行操作
cnt = [0] * (n + 1)
for x, y, val in options:
    # x 到 y 的简单路径上的 节点值 加上val
    cnt[x] += val
    cnt[y] += val
    fx = lca(x, y)
    cnt[fx] -= val
    cnt[pa[fx][0]] -= val

def dfs1(fa, x):
    """DFS计算最终的节点值"""
    for y in g[x]:
        if y != fa:
            cnt[x] += dfs1(x, y)
    return cnt[x]

dfs1(0, 1)
print("树上差分结果:", cnt)
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

