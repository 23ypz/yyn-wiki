# 带权并查集

带权并查集不仅判断两个点是否在同一集合中，还维护点与代表元之间的相对关系。它常用于差值约束、相对距离、同余关系、食物链关系等问题。

## 例题：维护差值关系

!!! example "例题"
    给出若干条关系 `to - from = value`，每次加入一条新关系时，判断它是否与已有关系矛盾。

## 原理详解

普通并查集只关心根是谁，带权并查集还要维护 `dis[x]`。这里的模板约定：

\[
dis[x] = x \text{ 到所在集合代表元的相对距离}
\]

路径压缩时，不能只改父节点，还必须把距离累加到新根。假设压缩前是：

\[
x \to fa[x] \to root
\]

那么压缩后 `x` 直接连到 `root`，距离应为两段之和：

\[
dis[x] \leftarrow dis[x] + dis[fa[x]]
\]

合并时最关键的是固定关系方向。本模板固定新关系为：

\[
to-from=value
\]

如果 `from` 和 `to` 已经在同一集合，就用已有距离计算它们的差，判断是否等于 `value`；如果不在同一集合，就把一个根挂到另一个根，并计算新根边权。

## 代码模板

```python
class UnionFind:
    """带权并查集，维护节点间的关系"""
    def __init__(self, n: int):
        # 一开始有 n 个集合 {0}, {1}, ..., {n-1}
        # 集合 i 的代表元是自己，自己到自己的距离是 0
        self.fa = list(range(n))  # 代表元
        self.dis = [0] * n  # dis[x] 表示 x 到（x 所在集合的）代表元的距离

    def find(self, x: int) -> int:
        """返回 x 所在集合的代表元，同时做路径压缩"""
        fa = self.fa
        if fa[x] != x:
            root = self.find(fa[x])
            self.dis[x] += self.dis[fa[x]]  # 递归更新 x 到其代表元的距离
            fa[x] = root
        return fa[x]

    def same(self, x: int, y: int) -> bool:
        """判断 x 和 y 是否在同一个集合"""
        return self.find(x) == self.find(y)

    def get_relative_distance(self, from_: int, to: int) -> int:
        """计算从 from 到 to 的相对距离"""
        self.find(from_)
        self.find(to)
        # to-from = (x-from) - (x-to) = dis[from] - dis[to]
        return self.dis[from_] - self.dis[to]

    def merge(self, from_: int, to: int, value: int) -> bool:
        """合并 from 和 to，新增信息 to - from = value"""
        x, y = self.find(from_), self.find(to)
        dis = self.dis
        if x == y:  # from 和 to 在同一个集合，不做合并
            # to-from = (x-from) - (x-to) = dis[from] - dis[to] = value
            return dis[from_] - dis[to] == value

        #    x --------- y
        #   /           /
        # from ------- to
        # 已知 x-from = dis[from] 和 y-to = dis[to]，现在合并 from 和 to，新增信息 to-from = value
        # 由于 y-from = (y-x) + (x-from) = (y-to) + (to-from)
        # 所以 y-x = (to-from) + (y-to) - (x-from) = value + dis[to] - dis[from]
        dis[x] = value + dis[to] - dis[from_]  # 计算 x 到其代表元 y 的距离
        self.fa[x] = y
        return True
```

## 易错点

- 路径压缩时必须更新 `dis[x]`。
- 合并公式要固定语义，例如始终写成 `to - from = value`，否则很容易写反。

## 易错点

- 路径压缩时必须先保存旧父节点，否则更新距离时会丢信息。
- 合并公式要固定语义，不能一会儿写 `to-from`，一会儿写 `from-to`。
- 两点已经在同一集合时，`merge` 应该用于判断矛盾，而不是重复合并。
