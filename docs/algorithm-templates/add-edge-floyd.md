# 可加边 Floyd

如果点数较小，并且需要频繁查询任意两点最短路，可以用 Floyd 预处理全源最短路。新增一条边后，可以用这条边尝试更新所有点对的距离。

## 例题：小图动态加边

!!! example "例题：加边后频繁查询"
    给定一个有向带权图，支持添加一条边 $(x,y,w)$，并频繁查询任意两点最短距离。

## 思路

维护矩阵 $f[i][j]$ 表示当前图中从 $i$ 到 $j$ 的最短距离。

如果新增边为 $(x,y,w)$，那么所有可能变短的路径都形如：

$$
i \to x \to y \to j
$$

因此可以用：

$$
f[i][j] = \min(f[i][j], f[i][x] + w + f[y][j])
$$

更新所有点对。

## 代码模板

```python
inf = float('inf')


class Graph:
    """支持动态加边，并用 Floyd 维护全源最短路。"""

    def __init__(self, n: int, edges):
        f = [[inf] * n for _ in range(n)]
        for i in range(n):
            f[i][i] = 0

        for x, y, w in edges:
            f[x][y] = min(f[x][y], w)

        for k in range(n):
            for i in range(n):
                if f[i][k] == inf:
                    continue
                for j in range(n):
                    if f[k][j] != inf:
                        f[i][j] = min(f[i][j], f[i][k] + f[k][j])

        self.f = f

    def addEdge(self, edge) -> None:
        x, y, w = edge
        f = self.f
        n = len(f)

        if w >= f[x][y]:
            return

        for i in range(n):
            if f[i][x] == inf:
                continue
            for j in range(n):
                if f[y][j] != inf:
                    f[i][j] = min(f[i][j], f[i][x] + w + f[y][j])

    def shortestPath(self, start: int, end: int) -> int:
        ans = self.f[start][end]
        return ans if ans < inf else -1


# 示例
graph = Graph(4, [(0, 1, 5), (0, 2, 9), (1, 2, 3), (2, 3, 1)])
print(graph.shortestPath(0, 3))
graph.addEdge((0, 1, 2))
print(graph.shortestPath(0, 3))
```

## 复杂度

- 初始化 Floyd：$O(n^3)$
- 加边更新：$O(n^2)$
- 单次查询：$O(1)$
- 空间复杂度：$O(n^2)$

## 易错点

- 上面的 $O(n^2)$ 更新适用于只添加边、不删除边的情况。
- 如果新增边没有让 $f[x][y]$ 变小，则不需要更新。
- 点数较大时矩阵空间会很高，不适合使用 Floyd。
