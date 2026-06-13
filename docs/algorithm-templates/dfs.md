---
tags:
  - yyn
  - 算法模板
---

# 深度优先搜索DFS
**算法介绍：**
深度优先搜索是一种图遍历算法，它沿着一条路径尽可能深地探索，直到到达末端，然后回溯到上一个节点，继续探索其他路径。

**应用场景：**
- 连通性检测
- 路径查找
- 拓扑排序
- 二分图判断

### DFS计算每个连通块大小

```python
def solve(n: int, edges):
    """计算图中每个连通块的大小"""
    # 节点编号从 0 到 n-1
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)  # 无向图

    vis = [False] * n

    def dfs(x: int) -> int:
        """DFS计算以x为起点的连通块大小"""
        vis[x] = True  # 避免重复访问节点
        size = 1  # 当前节点
        for y in g[x]:
            if not vis[y]:
                size += dfs(y)  # 递归访问邻居
        return size

    # 计算每个连通块的大小
    ans = []
    for i, b in enumerate(vis):
        if not b:  # i 没有访问过
            size = dfs(i)
            ans.append(size)
    return ans

# 示例使用
n = 6
edges = [(0, 1), (1, 2), (3, 4), (4, 5)]
print("各连通块大小:", solve(n, edges))  # 输出 [3, 3]
```

### 二分图染色

```python
# 返回图的二染色
# 如果是二分图，返回每个节点的颜色，用 1 和 2 表示两种颜色
# 如果不是二分图，返回空列表
# 时间复杂度 O(n+m)，n 是点数，m 是边数
def colorBipartite(n: int, edges):
    """判断图是否为二分图并进行染色"""
    # 建图（节点编号从 0 到 n-1）
    g = [[] for _ in range(n)]
    for x, y in edges:
        g[x].append(y)
        g[y].append(x)

    # colors[i] = 0 表示未访问节点 i
    # colors[i] = 1 表示节点 i 为红色
    # colors[i] = 2 表示节点 i 为蓝色
    colors = [0] * n

    def dfs(x: int, c: int) -> bool:
        """DFS染色，返回是否成功染色"""
        colors[x] = c  # 节点 x 染成颜色 c
        for y in g[x]:
            # 邻居 y 的颜色与 x 的相同，说明不是二分图，返回 False
            # 或者继续递归，发现不是二分图，返回 False
            if colors[y] == c or \
                    colors[y] == 0 and not dfs(y, 3 - c):  # 1 和 2 交替染色
                return False
        return True

    # 可能有多个连通块
    for i, c in enumerate(colors):
        if c == 0 and not dfs(i, 1):
            # 从节点 i 开始递归，发现 i 所在连通块不是二分图
            return []
    return colors

# 示例使用
n = 4
edges = [(0, 1), (1, 2), (2, 3)]  # 路径图，是二分图
colors = colorBipartite(n, edges)
print("二分图染色结果:", colors)  # 输出 [1, 2, 1, 2]

edges2 = [(0, 1), (1, 2), (2, 0)]  # 三角形，不是二分图
colors2 = colorBipartite(n, edges2)
print("非二分图染色结果:", colors2)  # 输出 []
```

### 图上DFS

```python
g = [[1, 2, 0],     # 网格图，0表示障碍，>0表示可通行
     [3, 4, 0],
     [0, 0, 5]]

n, m = len(g), len(g[0])
dic_1 = [(0, 1), (0, -1), (-1, 0), (1, 0)]  # 四个方向
f = 0

def dfs(x, y):
    """DFS遍历网格图"""
    global f
    f += g[x][y]  # 累加当前格子的值
    for dx, dy in dic_1:
        nx = x + dx
        ny = y + dy
        if 0 <= nx < n and 0 <= ny < m and g[nx][ny] > 0:
            dfs(nx, ny)

# 遍历所有连通块
for i in range(n):
    for j in range(m):
        if g[i][j]:
            f = 0
            dfs(i, j)
            print(f"连通块({i},{j})的和:", f)
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

