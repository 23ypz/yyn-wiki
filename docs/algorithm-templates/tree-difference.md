# 树上差分

树上差分常用于处理大量树上路径加值问题。它的思想类似普通差分：先在端点和 LCA 处打标记，最后自底向上汇总。

## 例题：树上路径点权加

!!! example "例题：多次路径加值"
    给定一棵树和若干次操作，每次给路径 $x\to y$ 上的所有点加上 $val$。最后输出每个点的值。

## 点权路径加公式

设 $p=\operatorname{lca}(x,y)$。如果要给路径 $x\to y$ 上的点权加 $val$，可以这样打标记：

$$
\begin{aligned}
cnt[x] &\mathrel{+}= val \
cnt[y] &\mathrel{+}= val \
cnt[p] &\mathrel{-}= val \
cnt[parent[p]] &\mathrel{-}= val
\end{aligned}
$$

最后从叶子向根做一次 DFS，把子树贡献累加到父节点：

$$
cnt[x] = cnt[x] + \sum_{y\in son(x)} cnt[y]
$$

这样路径上的点会被保留下贡献，路径外的点会互相抵消。

## 图示：路径 4 → 5 的点权加值

下面用操作“给路径 4→5 上的所有点加 3”演示树上差分。要点是：**先打标记，再统一汇总，不能边操作边统计答案。**

<div class="yyn-carousel" tabindex="0" aria-label="树上差分过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：确定要加值的路径 4→5。"><img src="../../assets/images/graph-tree/tree-diff-step-1.svg" alt="树上差分第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：求出 LCA=2，并按点权差分公式打标记。"><img src="../../assets/images/graph-tree/tree-diff-step-2.svg" alt="树上差分第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：所有操作都打完标记后，再自底向上汇总。"><img src="../../assets/images/graph-tree/tree-diff-step-3.svg" alt="树上差分第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：路径上的点 4、2、5 保留下贡献，其余点被抵消。"><img src="../../assets/images/graph-tree/tree-diff-step-4.svg" alt="树上差分第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 4</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：确定要加值的路径 4→5。</div>
</div>

## 代码模板

```python
class TreeDifference:
    """树上差分：路径点权加。节点编号从 1 到 n。"""

    def __init__(self, n: int, edges, root: int = 1):
        self.n = n
        self.LOG = (n + 1).bit_length()
        self.g = [[] for _ in range(n + 1)]
        for u, v in edges:
            self.g[u].append(v)
            self.g[v].append(u)

        self.depth = [0] * (n + 1)
        self.pa = [[0] * self.LOG for _ in range(n + 1)]
        self.cnt = [0] * (n + 1)
        self._dfs_init(root, 0)

    def _dfs_init(self, x: int, fa: int):
        self.depth[x] = self.depth[fa] + 1
        self.pa[x][0] = fa
        for k in range(1, self.LOG):
            self.pa[x][k] = self.pa[self.pa[x][k - 1]][k - 1]
        for y in self.g[x]:
            if y != fa:
                self._dfs_init(y, x)

    def lca(self, x: int, y: int) -> int:
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

    def add_path(self, x: int, y: int, val: int):
        p = self.lca(x, y)
        self.cnt[x] += val
        self.cnt[y] += val
        self.cnt[p] -= val
        self.cnt[self.pa[p][0]] -= val

    def collect(self, root: int = 1):
        def dfs(x: int, fa: int):
            for y in self.g[x]:
                if y != fa:
                    self.cnt[x] += dfs(y, x)
            return self.cnt[x]
        dfs(root, 0)
        return self.cnt[1:]
```
