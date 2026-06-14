# Dijkstra 算法

Dijkstra 算法用于求非负边权图上的单源最短路。它每次选择当前距离最小且尚未确定的点，并用这个点去松弛它的邻居。

## 例题：非负权单源最短路

!!! example "例题：从起点到所有点的最短距离"
    给定一个有 $n$ 个点、$m$ 条边的无向带权图，边权非负。求从起点 $s$ 到所有点的最短距离。

## 核心思想

设 $dis[x]$ 表示当前已知从起点到 $x$ 的最短距离估计值。若当前取出的点为 $u$，并且边 $(u,v)$ 的权值为 $w$，则尝试更新：

$$
dis[v] = \min(dis[v], dis[u] + w)
$$

这个操作称为“松弛”。

Dijkstra 正确性的关键在于：边权非负时，堆中当前最小的未确定距离不会再被之后的路径变小，因此可以确定下来。

## 图示：堆优化 Dijkstra 的松弛过程

下面用一个 4 个点的样例图演示堆优化 Dijkstra。重点观察三件事：

1. 当前从堆中弹出的点是谁；
2. 哪些边会被用于松弛；
3. 距离数组 `dis` 是如何一步步变小的。

<div class="yyn-carousel" tabindex="0" aria-label="Dijkstra 过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：初始化，只有起点 1 的距离为 0。"><img src="../../assets/images/graph-tree/dijkstra-step-1.svg" alt="Dijkstra 第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：弹出点 1，用它去松弛 1→2 和 1→3。"><img src="../../assets/images/graph-tree/dijkstra-step-2.svg" alt="Dijkstra 第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：弹出点 2，再次松弛相邻边，更新出更短的 dis[3]。"><img src="../../assets/images/graph-tree/dijkstra-step-3.svg" alt="Dijkstra 第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：弹出点 3，用 3→4 把 dis[4] 从 6 更新为 5。"><img src="../../assets/images/graph-tree/dijkstra-step-4.svg" alt="Dijkstra 第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 4</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：初始化，只有起点 1 的距离为 0。</div>
</div>

## 代码模板

```python
from heapq import heappush, heappop


def dijkstra(n: int, edges, start: int):
    """非负权图单源最短路。节点编号从 1 到 n。"""
    g = [[] for _ in range(n + 1)]
    for u, v, w in edges:
        g[u].append((v, w))
        g[v].append((u, w))

    inf = float('inf')
    dis = [inf] * (n + 1)
    dis[start] = 0
    heap = [(0, start)]

    while heap:
        d, u = heappop(heap)
        if d > dis[u]:
            continue
        for v, w in g[u]:
            nd = d + w
            if nd < dis[v]:
                dis[v] = nd
                heappush(heap, (nd, v))

    return [-1 if x == inf else x for x in dis[1:]]
```
