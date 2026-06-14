# 图上 DFS

图上 DFS 的核心是“沿一条路走到底，再回溯”。它常用于可达性判断、路径搜索、拓扑相关问题、回溯枚举等。

## 例题：从起点能否到达终点

!!! example "例题：路径存在性"
    给定一个无向图、起点 $s$ 和终点 $t$，判断是否存在从 $s$ 到 $t$ 的路径。

## 思路

DFS 访问一个点时，将它标记为已访问，然后递归访问所有未访问的邻居。若在搜索过程中访问到终点，则说明存在路径。

递归搜索可以理解为：

$$
\operatorname{reachable}(x)=\bigvee_{y\in adj(x)}\operatorname{reachable}(y)
$$

其中 $adj(x)$ 是点 $x$ 的邻居集合。

## 代码模板

```python
def has_path(n: int, edges, start: int, target: int) -> bool:
    """判断无向图中 start 是否可以到达 target。"""
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)

    vis = [False] * n

    def dfs(x: int) -> bool:
        if x == target:
            return True
        vis[x] = True
        for y in g[x]:
            if not vis[y] and dfs(y):
                return True
        return False

    return dfs(start)


# 示例
n = 5
edges = [(0, 1), (1, 2), (3, 4)]
print(has_path(n, edges, 0, 2))  # True
print(has_path(n, edges, 0, 4))  # False
```

## 非递归写法

递归 DFS 容易受到递归深度限制，非递归写法更稳。

```python
def has_path_iterative(n: int, edges, start: int, target: int) -> bool:
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)

    vis = [False] * n
    stack = [start]
    vis[start] = True

    while stack:
        x = stack.pop()
        if x == target:
            return True
        for y in g[x]:
            if not vis[y]:
                vis[y] = True
                stack.append(y)
    return False
```

## 复杂度

- 时间复杂度：$O(n+m)$
- 空间复杂度：$O(n+m)$

## 易错点

- 必须标记访问状态，否则有环图会无限递归。
- 如果要枚举所有路径，回溯时需要撤销访问标记；如果只是判断可达，不能撤销。
- DFS 不保证最短路，无权最短路应该用 BFS。
