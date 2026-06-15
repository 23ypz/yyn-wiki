# 普通并查集

并查集用于维护若干个不相交集合。它最适合处理“合并两个集合”和“判断两个元素是否属于同一集合”这类问题。

## 例题：连通性查询

!!! example "例题"
    初始有 \(n\) 个点，每个点单独构成一个集合。给定若干次操作，每次要么合并两个点所在集合，要么询问两个点是否连通。

## 原理详解

并查集把每个集合表示成一棵树，树根就是这个集合的代表元。数组 `fa[x]` 表示 `x` 的父节点。如果 `fa[x] == x`，说明 `x` 是根。

判断两个元素是否在同一集合中，只需要比较它们的根：

\[
find(x)=find(y)
\]

`union(x,y)` 的本质不是直接把 `x` 挂到 `y` 上，而是先找到它们各自的根，再合并两个根。这样才能保证合并的是两个集合，而不是两个普通节点。

路径压缩会在 `find` 的递归回溯过程中，把路径上的节点直接挂到根下面：

\[
fa[x] \leftarrow find(fa[x])
\]

按大小合并则是把小集合挂到大集合下面，减少树高。两者配合后，并查集的单次操作在实际使用中几乎可以看作常数。

## 图示：合并与路径压缩

<div class="yyn-carousel" tabindex="0" aria-label="并查集合并与路径压缩手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：初始化时，每个点都是自己的根。"><img src="../../assets/images/data-structures/dsu-step-1.svg" alt="并查集第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：合并 1 和 2、3 和 4。"><img src="../../assets/images/data-structures/dsu-step-2.svg" alt="并查集第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：继续合并 2 和 3，本质上是合并两个根。"><img src="../../assets/images/data-structures/dsu-step-3.svg" alt="并查集第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：find(4) 后路径压缩。"><img src="../../assets/images/data-structures/dsu-step-4.svg" alt="并查集第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：初始化时，每个点都是自己的根。</div>
</div>

## 代码模板

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

## 复杂度

使用路径压缩和按大小合并后，单次操作的均摊复杂度近似为：

\[
O(\alpha(n))
\]

实际使用时可以近似看成常数复杂度。

## 易错点

- `union` 一定要合并根节点。
- 只有两个根不同，连通块数量 `part` 才能减少。
- 如果题目节点从 1 开始编号，数组大小和初始化范围要相应调整。
