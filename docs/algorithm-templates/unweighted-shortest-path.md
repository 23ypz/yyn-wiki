# 无权图最短路

当图中所有边权都相同，通常视为边权为 $1$。此时不需要 Dijkstra，用 BFS 即可求单源最短路。

## 例题：无权图单源最短路

!!! example "例题：从起点到所有点的最短距离"
    给定一个无向无权图和起点 $s$，求 $s$ 到每个点的最短边数。若某个点不可达，则距离为 $-1$。

## 思路

BFS 按照距离从小到大访问节点。设当前访问到点 $u$，邻居为 $v$，如果 $v$ 没有访问过，那么：

$$
\operatorname{dis}[v] = \operatorname{dis}[u] + 1
$$

由于队列中的点按距离分层处理，所以第一次到达 $v$ 时一定是最短路径。

## 代码模板

```python
from collections import deque


def bfs_shortest_path(n: int, edges, start: int):
    """无权图单源最短路。

    节点编号从 0 到 n-1。
    """
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)

    dis = [-1] * n
    dis[start] = 0
    q = deque([start])

    while q:
        x = q.popleft()
        for y in g[x]:
            if dis[y] == -1:
                dis[y] = dis[x] + 1
                q.append(y)

    return dis


# 示例
n = 6
edges = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5)]
print(bfs_shortest_path(n, edges, 0))
```

## 复杂度

邻接表中每个点和每条边都会被遍历常数次。

- 时间复杂度：$O(n+m)$
- 空间复杂度：$O(n+m)$

## 易错点

- 无权图最短路用 BFS，不要误用普通 DFS。
- 有向图建边时不能反向加边。
- 如果图可能不连通，未访问点距离保持为 $-1$。
