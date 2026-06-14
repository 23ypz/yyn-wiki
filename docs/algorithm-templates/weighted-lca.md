# 带权树 LCA

在带权树中，任意两点之间只有一条简单路径。因此只要知道根到每个点的距离，就可以用 LCA 快速求两点距离。

## 例题：树上两点距离

!!! example "例题：多次查询树上距离"
    给定一棵带权树，多次询问两个点 $x,y$ 之间的路径长度。

## 距离公式

设 $dis[x]$ 表示根到 $x$ 的距离，$p=\operatorname{lca}(x,y)$。则路径 $x\to y$ 可以拆成 $x\to p$ 和 $p\to y$ 两段：

$$
\operatorname{dist}(x,y) = dis[x] + dis[y] - 2\cdot dis[p]
$$

这个公式是带权树 LCA 的核心。

## 代码模板

```python
class WeightedLCA:
    """带权树 LCA，节点编号从 0 到 n-1。"""

    def __init__(self, n: int, edges, root: int = 0):
        self.LOG = n.bit_length()
        g = [[] for _ in range(n)]
        for x, y, w in edges:
            g[x].append((y, w))
            g[y].append((x, w))

        self.depth = [0] * n
        self.dis = [0] * n
        self.pa = [[-1] * n for _ in range(self.LOG)]

        def dfs(x: int, fa: int):
            self.pa[0][x] = fa
            for y, w in g[x]:
                if y != fa:
                    self.depth[y] = self.depth[x] + 1
                    self.dis[y] = self.dis[x] + w
                    dfs(y, x)

        dfs(root, -1)

        for k in range(self.LOG - 1):
            for x in range(n):
                p = self.pa[k][x]
                if p != -1:
                    self.pa[k + 1][x] = self.pa[k][p]

    def get_kth_ancestor(self, x: int, k: int) -> int:
        for i in range(k.bit_length()):
            if k >> i & 1:
                x = self.pa[i][x]
                if x == -1:
                    return -1
        return x

    def lca(self, x: int, y: int) -> int:
        if self.depth[x] > self.depth[y]:
            x, y = y, x
        y = self.get_kth_ancestor(y, self.depth[y] - self.depth[x])
        if x == y:
            return x

        for i in range(self.LOG - 1, -1, -1):
            px, py = self.pa[i][x], self.pa[i][y]
            if px != py:
                x, y = px, py
        return self.pa[0][x]

    def distance(self, x: int, y: int) -> int:
        p = self.lca(x, y)
        return self.dis[x] + self.dis[y] - 2 * self.dis[p]


# 示例
edges = [(0, 1, 2), (1, 2, 3), (1, 3, 4), (3, 4, 5)]
lca = WeightedLCA(5, edges)
print(lca.lca(2, 4))       # 1
print(lca.distance(2, 4))  # 12
```

## 复杂度

- 预处理复杂度：$O(n\log n)$
- 单次 LCA / 距离查询：$O(\log n)$
- 空间复杂度：$O(n\log n)$

## 易错点

- `dis[x]` 是根到点的距离，不是深度。
- 无权树中可以把边权看成 $1$，此时距离也可以用深度计算。
- 如果节点从 1 开始，需要建大小为 `n + 1` 的数组。
