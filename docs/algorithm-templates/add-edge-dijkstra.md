# 可加边 Dijkstra

当图会动态添加边，并且每次只查询一个起点到一个终点的最短路时，可以在每次查询时重新运行 Dijkstra。这个方法适合点边规模中等、查询次数不特别多的情况。

## 例题：动态加边后查询最短路

!!! example "例题：Graph 类设计"
    设计一个图结构，支持 `addEdge(u, v, w)` 添加有向边，并支持 `shortestPath(start, end)` 查询从 `start` 到 `end` 的最短距离。

## 思路

新增边只需要加入邻接表。每次查询时，以 `start` 为起点运行 Dijkstra，直到取出 `end` 时可以提前返回。

松弛公式仍然是：

$$
dis[v] = \min(dis[v], dis[u] + w(u,v))
$$

## 代码模板

```python
from heapq import heappush, heappop

inf = float('inf')


class Graph:
    """支持动态加边，并用 Dijkstra 按需查询最短路。"""

    def __init__(self, n: int, edges):
        self.g = [[] for _ in range(n)]
        for x, y, w in edges:
            self.g[x].append((y, w))

    def addEdge(self, edge) -> None:
        x, y, w = edge
        self.g[x].append((y, w))

    def shortestPath(self, start: int, end: int) -> int:
        dis = [inf] * len(self.g)
        dis[start] = 0
        heap = [(0, start)]

        while heap:
            d, x = heappop(heap)
            if x == end:
                return d
            if d > dis[x]:
                continue
            for y, w in self.g[x]:
                nd = d + w
                if nd < dis[y]:
                    dis[y] = nd
                    heappush(heap, (nd, y))

        return -1


# 示例
graph = Graph(5, [(0, 1, 2), (0, 2, 4), (1, 2, 1), (1, 3, 7)])
print(graph.shortestPath(0, 3))
graph.addEdge((2, 3, 3))
print(graph.shortestPath(0, 3))
```

## 复杂度

设一次查询时当前有 $n$ 个点、$m$ 条边。

- 加边复杂度：$O(1)$
- 单次查询复杂度：$O((n+m)\log n)$
- 空间复杂度：$O(n+m)$

## 适用场景

适合：

- 点边规模中等。
- 查询次数不太多。
- 每次查询起点终点不同。

不适合：

- 点数很小但查询极多，此时可考虑 Floyd 维护全源最短路。
- 有负边权，Dijkstra 不适用。
