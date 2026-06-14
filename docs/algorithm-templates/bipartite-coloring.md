# 二分图染色

二分图是指可以把点集分成两个集合，使得每条边的两个端点分别属于不同集合的图。判断二分图的常用方法是 DFS 或 BFS 染色。

## 例题：判断图是否为二分图

!!! example "例题：二染色"
    给定一个无向图，判断能否用两种颜色给所有点染色，使得任意一条边的两个端点颜色不同。

## 思路

对每个未染色的连通块，任选一个点染成颜色 $1$，然后把它的邻居染成颜色 $2$。如果某条边连接了两个相同颜色的点，则不是二分图。

用 $c_x$ 表示点 $x$ 的颜色。对于任意边 $(u,v)$，二分图必须满足：

$$
c_u \ne c_v
$$

如果使用颜色 $1$ 和 $2$，那么相邻点颜色可以用：

$$
c_v = 3 - c_u
$$

## 代码模板

```python
def color_bipartite(n: int, edges):
    """如果是二分图，返回颜色数组；否则返回空列表。"""
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)

    color = [0] * n

    def dfs(x: int, c: int) -> bool:
        color[x] = c
        for y in g[x]:
            if color[y] == c:
                return False
            if color[y] == 0 and not dfs(y, 3 - c):
                return False
        return True

    for i in range(n):
        if color[i] == 0:
            if not dfs(i, 1):
                return []
    return color


# 示例
n = 4
edges = [(0, 1), (1, 2), (2, 3)]
print(color_bipartite(n, edges))  # [1, 2, 1, 2]

edges2 = [(0, 1), (1, 2), (2, 0)]
print(color_bipartite(3, edges2))  # []，奇环不是二分图
```

## 为什么奇环不是二分图

沿着一条环交替染色，如果环长为偶数，最后可以回到起点且颜色不冲突；如果环长为奇数，最后会要求起点同时拥有两种颜色，产生矛盾。

## 复杂度

- 时间复杂度：$O(n+m)$
- 空间复杂度：$O(n+m)$

## 易错点

- 图可能不连通，所以要从每个未染色点开始 DFS。
- 自环一定不是二分图，因为一条边连接了同一个点。
- 递归深度较大时可以改用 BFS 染色。
