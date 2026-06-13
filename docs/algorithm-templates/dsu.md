---
tags:
  - yyn
  - 算法模板
---

# 并查集
**算法介绍：**
并查集（Disjoint Set Union，DSU）是一种树形数据结构，用于处理一些不交集的合并及查询问题。它支持两种操作：查找（Find）和合并（Union）。

**应用场景：**
- 判断图中两个节点是否连通
- Kruskal最小生成树算法
- 动态连通性问题
- 朋友圈问题

### 简单并查集

```python
n = 100
# 每个节点的父节点初始化为自己
fa = [i for i in range(n)]  # 父节点数组
size = [1] * n              # 每个集合的大小
part = n                    # 连通分量个数

def find(x):
    """查找x的根节点，带路径压缩"""
    if x != fa[x]:
        fa[x] = find(fa[x])  # 路径压缩
    return fa[x]

def union(x, y):
    """合并x和y所在的集合，按大小合并"""
    global part
    rx, ry = find(x), find(y)
    if rx == ry:
        return False  # 已经在同一个集合中
    if size[rx] > size[ry]:
        rx, ry = ry, rx  # 保证rx是较小的集合
    part -= 1
    fa[rx] = ry
    size[ry] += size[rx]
    size[rx] = 0
    return True
```

### 带权并查集

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

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

