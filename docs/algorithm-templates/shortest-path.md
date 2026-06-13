---
tags:
  - yyn
  - 算法模板
---

# 最短路
**算法介绍：**
最短路问题是图论中的经典问题，目标是找到图中两个节点之间的最短路径。常见的算法有Dijkstra、Floyd、Bellman-Ford等。

**应用场景：**
- 路径规划
- 网络优化
- 地图导航
- 游戏AI

### Dijkstra算法

```python
from heapq import heappush, heappop

n, m = 3, 3
grid = [(1, 2, 1), (1, 3, 5), (2, 3, 2)]  # 边：(u,v,w)
g = [[] for i in range(n + 1)]
for u, v, w in grid:
    g[u].append((v, w))
    g[v].append((u, w))  # 无向图

inf = float('inf')
dis = [inf] * (n + 1)
start = 1  # 起点
dis[start] = 0
stk = [(0, 1)]  # (距离, 节点)
vis = [False] * (n + 1)

while stk:
    _, u = heappop(stk)
    if vis[u]:
        continue
    vis[u] = True
    for v, w in g[u]:
        if dis[u] + w < dis[v]:
            dis[v] = dis[u] + w
            heappush(stk, (dis[v], v))

# 处理不可达的点
for i in range(n + 1):
    if dis[i] == inf:
        dis[i] = -1
print("从起点1到各点的距离:", dis[1:])
```

### Floyd算法

```python
n, m, q = 3, 3, 3
g = [(1, 2, 1), (1, 3, 5), (2, 3, 2)]
questions = [(1, 2), (1, 3), (2, 3)]

inf = float('inf')
f = [[inf] * (n + 1) for i in range(n + 1)]
for i in range(n + 1):
    f[i][i] = 0
for u, v, w in g:
    f[u][v] = w
    f[v][u] = w

# Floyd核心算法
for k in range(1, n + 1):
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            f[i][j] = min(f[i][j], f[i][k] + f[k][j])

# 回答查询
for i, j in questions:
    if f[i][j] == inf:
        print(-1)
    else:
        print(f[i][j])
```

### 可加边Dijkstra

```python
inf = float('inf')
from heapq import heappush, heappop

class Graph:
    """支持动态加边的图结构，使用Dijkstra算法"""
    def __init__(self, n: int, edges):
        self.g = [[] for _ in range(n)]  # 邻接表
        for x, y, w in edges:
            self.g[x].append((y, w))

    def addEdge(self, e) -> None:
        """动态添加边 e = (u, v, w)"""
        self.g[e[0]].append((e[1], e[2]))

    def shortestPath(self, start: int, end: int) -> int:
        """计算从start到end的最短路长度"""
        dis = [inf] * len(self.g)
        dis[start] = 0
        h = [(0, start)]
        while h:
            d, x = heappop(h)
            if x == end:
                return d
            if d > dis[x]:
                continue
            for y, w in self.g[x]:
                if d + w < dis[y]:
                    dis[y] = d + w
                    heappush(h, (dis[y], y))
        return -1  # 无法到达终点

# 示例使用
n = 5
edges = [(0, 1, 2), (0, 2, 4), (1, 2, 1), (1, 3, 7)]
graph = Graph(n, edges)
print("0到3的最短距离:", graph.shortestPath(0, 3))

# 动态添加边
graph.addEdge((2, 3, 3))
print("添加边后0到3的最短距离:", graph.shortestPath(0, 3))
```

### 可加边Floyd

```python
inf = float('inf')

class Graph:
    """支持动态加边的图结构，使用Floyd算法"""
    def __init__(self, n: int, edges):
        f = [[inf] * n for _ in range(n)]
        for i in range(n):
            f[i][i] = 0
        for x, y, w in edges:
            f[x][y] = w
        # 预处理Floyd
        for k in range(n):
            for i in range(n):
                if f[i][k] == inf: continue
                for j in range(n):
                    f[i][j] = min(f[i][j], f[i][k] + f[k][j])
        self.f = f

    def addEdge(self, edge) -> None:
        """动态添加边"""
        f = self.f
        x, y, w = edge
        if w >= f[x][y]:
            return
        n = len(f)
        # 更新所有经过新边x-y的最短路
        for i in range(n):
            for j in range(n):
                f[i][j] = min(f[i][j], f[i][x] + w + f[y][j])

    def shortestPath(self, start: int, end: int) -> int:
        """查询从start到end的最短路"""
        ans = self.f[start][end]
        return ans if ans < inf else -1

# 示例使用
n = 4
edges = [(0, 1, 5), (0, 2, 9), (1, 2, 3), (2, 3, 1)]
graph = Graph(n, edges)
print("0到3的最短距离:", graph.shortestPath(0, 3))

# 动态添加边
graph.addEdge((0, 1, 2))
print("添加边后0到3的最短距离:", graph.shortestPath(0, 3))
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

