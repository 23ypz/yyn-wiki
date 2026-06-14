# LCA 倍增

LCA 是 Lowest Common Ancestor，即最近公共祖先。在有根树中，两个点 $x,y$ 的 LCA 是同时作为它们祖先且深度最大的点。

## 例题：多次查询最近公共祖先

!!! example "例题：LCA 查询"
    给定一棵以 $1$ 为根的树，多次询问两个点 $x,y$ 的最近公共祖先。

## 核心思想

倍增法预处理每个点向上跳 $2^k$ 层到达的祖先。

令 $pa[x][k]$ 表示点 $x$ 的第 $2^k$ 个祖先，则有转移：

$$
pa[x][k] = pa[pa[x][k-1]][k-1]
$$

查询时分两步：

1. 先把较深的点向上跳到与另一个点相同深度。
2. 如果两个点不同，则从大到小尝试同时向上跳，直到它们的父节点相同。

## 图示：查询 LCA(8,5)

下面用一个固定样例展示倍增查询的流程。重点观察：**先对齐深度，再同步上跳，最后返回公共父亲。**

<div class="yyn-carousel" tabindex="0" aria-label="LCA 倍增查询手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：查询点是 8 和 5，先观察它们的深度。"><img src="../../assets/images/graph-tree/lca-step-1.svg" alt="LCA 第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：8 更深，先跳一层到 4，与 5 处于同一深度。"><img src="../../assets/images/graph-tree/lca-step-2.svg" alt="LCA 第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：此时 4 和 5 深度相同，从大到小尝试同步上跳。"><img src="../../assets/images/graph-tree/lca-step-3.svg" alt="LCA 第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：两点的父节点第一次相同，这个父节点就是最近公共祖先 2。"><img src="../../assets/images/graph-tree/lca-step-4.svg" alt="LCA 第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 4</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：查询点是 8 和 5，先观察它们的深度。</div>
</div>

## 代码模板

```python
class LCA:
    """倍增 LCA。节点编号从 1 到 n。"""

    def __init__(self, n: int, edges, root: int = 1):
        self.n = n
        self.LOG = (n + 1).bit_length()
        self.g = [[] for _ in range(n + 1)]
        for u, v in edges:
            self.g[u].append(v)
            self.g[v].append(u)

        self.depth = [0] * (n + 1)
        self.pa = [[0] * self.LOG for _ in range(n + 1)]
        self._dfs(root, 0)

    def _dfs(self, x: int, fa: int):
        self.depth[x] = self.depth[fa] + 1
        self.pa[x][0] = fa
        for k in range(1, self.LOG):
            self.pa[x][k] = self.pa[self.pa[x][k - 1]][k - 1]
        for y in self.g[x]:
            if y != fa:
                self._dfs(y, x)

    def query(self, x: int, y: int) -> int:
        if self.depth[x] < self.depth[y]:
            x, y = y, x
        diff = self.depth[x] - self.depth[y]
        for k in range(self.LOG):
            if diff >> k & 1:
                x = self.pa[x][k]
        if x == y:
            return x
        for k in range(self.LOG - 1, -1, -1):
            if self.pa[x][k] != self.pa[y][k]:
                x = self.pa[x][k]
                y = self.pa[y][k]
        return self.pa[x][0]
```
