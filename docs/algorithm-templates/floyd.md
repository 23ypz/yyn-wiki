# Floyd 算法

Floyd 算法用于求所有点对之间的最短路。它适合点数较小、需要频繁查询任意两点最短路的问题。

## 例题：多次查询任意两点最短路

!!! example "例题：全源最短路"
    给定一个带权图和 $q$ 次询问，每次询问两个点 $u,v$ 的最短距离。若不可达，输出 $-1$。

## 状态定义

设 $f[i][j]$ 表示当前已知的从 $i$ 到 $j$ 的最短距离。

Floyd 的核心是逐步允许更多中转点。枚举中转点 $k$ 时，尝试用路径 $i\to k\to j$ 更新 $i\to j$：

$$
f[i][j] = \min(f[i][j], f[i][k] + f[k][j])
$$

## 为什么 k 要放在最外层

当 $k$ 在最外层时，算法含义是：处理到第 $k$ 轮后，$f[i][j]$ 表示只允许经过编号不超过 $k$ 的点时，$i$ 到 $j$ 的最短距离。

如果随意交换三层循环顺序，就会破坏这个阶段含义。

## 代码模板

```python
def floyd(n: int, edges):
    """Floyd 全源最短路。节点编号从 1 到 n。"""
    inf = float('inf')
    f = [[inf] * (n + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        f[i][i] = 0

    for u, v, w in edges:
        if w < f[u][v]:
            f[u][v] = w
            f[v][u] = w

    for k in range(1, n + 1):
        for i in range(1, n + 1):
            if f[i][k] == inf:
                continue
            for j in range(1, n + 1):
                if f[k][j] != inf:
                    f[i][j] = min(f[i][j], f[i][k] + f[k][j])

    return f


# 示例
n = 3
edges = [(1, 2, 1), (1, 3, 5), (2, 3, 2)]
f = floyd(n, edges)
for u, v in [(1, 2), (1, 3), (2, 3)]:
    print(-1 if f[u][v] == float('inf') else f[u][v])
```

## 复杂度

- 时间复杂度：$O(n^3)$
- 空间复杂度：$O(n^2)$

## 易错点

- 初始化时 $f[i][i]=0$。
- 有重边时要取最小边权。
- 无向图要同时更新 $f[u][v]$ 和 $f[v][u]$。
- `inf + 数字` 虽然在 Python 中可行，但判断不可达可以减少无用运算。
