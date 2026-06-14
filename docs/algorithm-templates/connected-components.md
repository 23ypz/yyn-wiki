# 连通块大小

在无向图中，如果两个点之间存在一条路径，则它们属于同一个连通块。统计连通块大小是 DFS 的经典应用。

## 例题：统计每个连通块大小

!!! example "例题：朋友圈大小"
    给定 $n$ 个点和若干条无向边，统计图中每个连通块包含多少个点。

## 思路

从一个未访问的点开始 DFS，把所有能到达的点都标记为已访问。一次 DFS 访问到的所有点构成一个连通块。

设以 $x$ 为根进行 DFS，则连通块大小可以递归表示为：

$$
\operatorname{size}(x) = 1 + \sum_{y\in son(x)} \operatorname{size}(y)
$$

这里的 $son(x)$ 指 DFS 树中从 $x$ 继续访问到的未访问邻居。

## 代码模板

```python
def component_sizes(n: int, edges):
    """计算无向图中每个连通块大小。"""
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)

    vis = [False] * n

    def dfs(x: int) -> int:
        vis[x] = True
        size = 1
        for y in g[x]:
            if not vis[y]:
                size += dfs(y)
        return size

    ans = []
    for i in range(n):
        if not vis[i]:
            ans.append(dfs(i))
    return ans


# 示例
n = 6
edges = [(0, 1), (1, 2), (3, 4), (4, 5)]
print(component_sizes(n, edges))  # [3, 3]
```

## 复杂度

- 时间复杂度：$O(n+m)$
- 空间复杂度：$O(n+m)$

## 易错点

- 递归 DFS 在 Python 中可能爆栈，大图需要设置递归深度，或者改成显式栈。
- 无向图遍历时要靠 `vis` 防止来回访问。
- 如果只从 0 开始 DFS，会漏掉不连通的部分。
