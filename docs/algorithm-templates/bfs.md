---
tags:
  - yyn
  - 算法模板
---

# 广度优先搜索BFS
**算法介绍：**
广度优先搜索是一种图遍历算法，它从起始节点开始，逐层向外扩展，先访问距离起始节点最近的节点。

**应用场景：**
- 最短路径问题（无权图）
- 连通性检测
- 拓扑排序
- 迷宫最短路径

### 图上BFS

```python
import os
import sys
from collections import deque

# 四个方向：上、下、左、右
dic = [(1, 0), (-1, 0), (0, -1), (0, 1)]
n, m = 5, 5
x1, y1, x2, y2 = 1, 1, 5, 5
x1, y1, x2, y2 = x1 - 1, y1 - 1, x2 - 1, y2 - 1  # 转换为0-indexed

# 地图：'.'表示可通行，'#'表示障碍
g = ['...#.',
     '..#..',
     '#....',
     'V..#.',
     '...#.']

inf = float('inf')
dis1 = [[inf] * m for _ in range(n)]

def bfs(x, y, dist):
    """BFS计算从(x,y)到所有可达点的距离"""
    queue = deque()
    queue.append([x, y])  # 起点入队
    vis = [[0] * m for i in range(n)]
    dist[x][y] = 0
    vis[x][y] = 1
    while len(queue) != 0:
        x, y = queue.popleft()
        for i, j in dic:
            xx = x + i
            yy = y + j
            if 0 <= xx < n and 0 <= yy < m and g[xx][yy] != '#' and vis[xx][yy] == 0:
                vis[xx][yy] = 1
                queue.append([xx, yy])
                dist[xx][yy] = dist[x][y] + 1

# 示例使用：计算从起点到所有点的距离
bfs(x1, y1, dis1)
print("距离矩阵:")
for row in dis1:
    print(row)
```

### 单源最短路模板

```python
# 计算从 start 到各个节点的最短路长度
# 如果节点不可达，则最短路长度为 -1
# 节点编号从 0 到 n-1，边权均为 1
from collections import deque

def bfs(n: int, edges, start: int):
    """BFS计算无权图单源最短路"""
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)  # 无向图

    dis = [-1] * n  # -1 表示尚未访问到
    dis[start] = 0
    q = deque([start])
    while q:
        x = q.popleft()
        for y in g[x]:
            if dis[y] < 0:
                dis[y] = dis[x] + 1
                q.append(y)
    return dis

# 示例使用
n = 6
edges = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5)]
start = 0
distances = bfs(n, edges, start)
print("从起点0到各点的距离:", distances)
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

