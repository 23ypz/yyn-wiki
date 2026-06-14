# 图论与树总览

图论通常把对象抽象成“点”和“边”，研究点与点之间的可达性、距离、连通性和路径结构。树是一种特殊的图：连通且无环，很多树上问题都可以看作图论问题的特化。

本章节按照算法类型拆分：BFS、DFS、最短路和树上问题分别独立成页。这样比把所有内容放在一个页面中更方便查找，也更接近 OI Wiki 的组织方式。

## 常见图模型

设图为 $G=(V,E)$，其中 $V$ 是点集，$E$ 是边集。

- 若边没有方向，称为无向图。
- 若边有方向，称为有向图。
- 若每条边有权值 $w$，称为带权图。
- 若边权全部为 $1$，最短路可以用 BFS。
- 若边权非负，单源最短路常用 Dijkstra。
- 若需要多源最短路或所有点对最短路，常用 Floyd。

## 邻接表建图

图论题中最常用的是邻接表。对于 $n$ 个点、$m$ 条边，邻接表的空间复杂度为 $O(n+m)$。

```python
def build_graph(n, edges, directed=False):
    g = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        if not directed:
            g[v].append(u)
    return g
```

如果是带权图，则邻接表中保存二元组：

```python
def build_weighted_graph(n, edges, directed=False):
    g = [[] for _ in range(n)]
    for u, v, w in edges:
        g[u].append((v, w))
        if not directed:
            g[v].append((u, w))
    return g
```

## 如何选择算法

| 问题类型 | 常用算法 | 复杂度 |
|---|---|---|
| 无权图最短路 | BFS | $O(n+m)$ |
| 图的连通性 | DFS / BFS | $O(n+m)$ |
| 二分图判断 | DFS / BFS 染色 | $O(n+m)$ |
| 非负权单源最短路 | Dijkstra | $O((n+m)\log n)$ |
| 所有点对最短路 | Floyd | $O(n^3)$ |
| 树上最近公共祖先 | 倍增 LCA | 预处理 $O(n\log n)$，查询 $O(\log n)$ |
| 树上路径加点权 | 树上差分 | $O((n+q)\log n)$ 或 $O(n+q)$ 加 LCA 预处理 |

## 本章内容

- [网格 BFS](grid-bfs.md)：迷宫、棋盘、最短步数。
- [无权图最短路](unweighted-shortest-path.md)：边权全为 $1$ 的图上距离。
- [连通块大小](connected-components.md)：用 DFS 统计每个连通块。
- [二分图染色](bipartite-coloring.md)：判断图是否可二染色。
- [图上 DFS](graph-dfs.md)：递归遍历、路径搜索、回溯。
- [Dijkstra 算法](dijkstra.md)：非负权单源最短路。
- [Floyd 算法](floyd.md)：所有点对最短路。
- [可加边 Dijkstra](add-edge-dijkstra.md)：动态加边后按需查询最短路。
- [可加边 Floyd](add-edge-floyd.md)：点数较小时维护全源最短路。
- [LCA 倍增](lca-binary-lifting.md)：树上最近公共祖先。
- [带权树 LCA](weighted-lca.md)：树上距离查询。
- [树上差分](tree-difference.md)：树上路径批量加值。
