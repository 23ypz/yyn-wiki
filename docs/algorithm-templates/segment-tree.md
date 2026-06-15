# 线段树

线段树用于维护区间信息，例如区间最大值、区间最小值、区间和等。它适合“信息可以由左右子区间合并得到”的问题。

## 原理详解

线段树是一棵二叉区间树。根节点维护整个区间，左右儿子分别维护左右半区间。如果当前节点维护 \([l,r]\)，令：

\[
mid=\left\lfloor\frac{l+r}{2}\right\rfloor
\]

那么左右儿子分别维护：

\[
[l,mid],\quad [mid+1,r]
\]

如果维护最大值，父节点由左右儿子合并：

\[
tree[o]=\max(tree[o\cdot2],tree[o\cdot2+1])
\]

查询区间时，如果当前节点区间完全包含在查询区间内，就可以直接返回这个节点的值；如果只部分相交，就继续递归到左右儿子。单点修改时，只会影响从叶子到根的一条链，沿途重新合并即可。

## 图示：查询、修改与维护

<div class="yyn-carousel" tabindex="0" aria-label="线段树过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：线段树是一棵二叉区间树。"><img src="../../assets/images/data-structures/segment-tree-step-1.svg" alt="线段树第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：查询 [3,6] 可拆成 [3,4] 和 [5,6]。"><img src="../../assets/images/data-structures/segment-tree-step-2.svg" alt="线段树第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：单点修改 pos=3，只影响一条根到叶子的链。"><img src="../../assets/images/data-structures/segment-tree-step-3.svg" alt="线段树第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：区间修改时可以在整段节点上打 lazy 标记。"><img src="../../assets/images/data-structures/segment-tree-step-4.svg" alt="线段树第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：线段树是一棵二叉区间树。</div>
</div>

## 通用线段树模板

```python
# 线段树有两个下标，一个是线段树节点的下标，另一个是线段树维护的区间的下标
# 节点的下标：从 1 开始，如果你想改成从 0 开始，需要把左右儿子下标分别改成 node*2+1 和 node*2+2
# 区间的下标：从 0 开始
class SegmentTree:
    def __init__(self, arr, default=0):
        # 线段树维护一个长为 n 的数组（下标从 0 到 n-1）
        if isinstance(arr, int):
            arr = [default] * arr
        n = len(arr)
        self._n = n
        self._tree = [0] * (2 << (n - 1).bit_length())
        self._build(arr, 1, 0, n - 1)

    # 合并两个 val
    def _merge_val(self, a, b):
        return max(a, b)  # **根据题目修改**

    # 合并左右儿子的 val 到当前节点的 val
    def _maintain(self, node):
        self._tree[node] = self._merge_val(self._tree[node * 2], self._tree[node * 2 + 1])

    # 用 a 初始化线段树
    def _build(self, a, node, l, r):
        if l == r:  # 叶子
            self._tree[node] = a[l]
            return
        m = (l + r) // 2
        self._build(a, node * 2, l, m)
        self._build(a, node * 2 + 1, m + 1, r)
        self._maintain(node)

    # 单点修改：把 a[pos] 改成 val
    def point_update(self, pos, val):
        self._update(1, 0, self._n - 1, pos, val)

    def _update(self, node, l, r, pos, val):
        if l == r:  # 叶子（到达目标）
            self._tree[node] = val
            return
        m = (l + r) // 2
        if pos <= m:  # 在左子树
            self._update(node * 2, l, m, pos, val)
        else:  # 在右子树
            self._update(node * 2 + 1, m + 1, r, pos, val)
        self._maintain(node)

    # 区间查询：查询 [l,r] 的结果
    def range_query(self, ql, qr):
        return self._query(1, 0, self._n - 1, ql, qr)

    def _query(self, node, l, r, ql, qr):
        if ql <= l and r <= qr:  # 完全包含
            return self._tree[node]
        m = (l + r) // 2
        if qr <= m:  # 完全在左子树
            return self._query(node * 2, l, m, ql, qr)
        if ql > m:  # 完全在右子树
            return self._query(node * 2 + 1, m + 1, r, ql, qr)
        # 跨越左右子树
        left_val = self._query(node * 2, l, m, ql, qr)
        right_val = self._query(node * 2 + 1, m + 1, r, ql, qr)
        return self._merge_val(left_val, right_val)

# 示例使用
arr = [1, 3, 2, 7, 9, 11]
st = SegmentTree(arr)
print("区间[1,4]的最大值:", st.range_query(1, 4))
st.point_update(2, 10)  # 把位置2的值改成10
print("修改后区间[1,4]的最大值:", st.range_query(1, 4))
```

## 单点修改、区间查询最大值模板

```python
# 线段树：单点修改、区间查询最大值
class SegTree:
    def __init__(self, n):
        # 小优化空间
        size = 2 << n.bit_length()
        self.mx = [0] * size

    # o为当前节点,l,r为当前节点的区间[l,r],idx和val表示单点修改
    def update(self, o, l, r, idx, val):
        """单点修改：将位置idx的值改为val"""
        # 如果到达叶子结点
        if l == r:
            self.mx[o] = val
            return
        mid = (l + r) // 2
        # 如果要修改的下标小于等于区间的中点
        if idx <= mid:
            # 递归左子树
            self.update(o * 2, l, mid, idx, val)
        else:
            # 否则就递归右子树
            self.update(o * 2 + 1, mid + 1, r, idx, val)
        # 将当前节点的值更新为左右子树的最大值
        self.mx[o] = max(self.mx[2 * o], self.mx[2 * o + 1])

    # 区间查询最值操作
    # 在节点为o的区间[l,r]上查询[L,R]的最大值
    def query(self, o, l, r, L, R):
        """区间查询：查询区间[L,R]的最大值"""
        # 如果该区间[L,R]包含[l,r]
        if l >= L and r <= R:
            # 那么直接返回这个区间的最大值
            return self.mx[o]
        mid = (l + r) // 2
        res = 0
        # 如果区间L小于等于mid，那么需要递归左子树
        if L <= mid:
            res = max(res, self.query(o * 2, l, mid, L, R))
        # 如果区间R大于等于mid+1，那么需要递归右子树
        if R >= mid + 1:
            res = max(res, self.query(o * 2 + 1, mid + 1, r, L, R))
        return res

# 示例使用
n = 5
st = SegTree(n)
# 初始化：假设初始数组为[1,2,3,4,5]
for i in range(n):
    st.update(1, 0, n - 1, i, i + 1)
print("初始区间[1,4]的最大值:", st.query(1, 0, n - 1, 0, 3))
# 单点修改：将位置2的值改为10
st.update(1, 0, n - 1, 2, 10)
print("修改后区间[1,4]的最大值:", st.query(1, 0, n - 1, 0, 3))
```

## 易错点

- 线段树节点下标和原数组下标是两套下标。
- 递归参数中的 `[l,r]` 是当前节点维护的区间，`[ql,qr]` 是查询区间。
- 空间通常开到 `4*n` 或使用 `2 << (n-1).bit_length()`。
