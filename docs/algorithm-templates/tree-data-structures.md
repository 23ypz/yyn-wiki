---
tags:
  - yyn
  - 算法模板
---

# 树形数据结构
**算法介绍：**
树形数据结构是专门用于处理树和序列操作的数据结构，包括树状数组、线段树、ST表等。

**应用场景：**
- 区间查询和修改
- 序列操作
- 树上操作
- 动态维护信息

### 树状数组

```python
class BIT:
    """树状数组，支持单点修改和区间查询"""
    def __init__(self, nums):
        n = len(nums)
        tree = [0] + nums
        # 构建树状数组
        for i in range(1, n + 1):
            j = i + (i & -i)
            if j <= n:
                tree[j] += tree[i]
        self.tree = tree

    def add(self, i, val=1):
        """在位置i加上val"""
        while i < len(self.tree):
            self.tree[i] += val
            i += i & -i

    def query(self, i):
        """查询前i个数的和"""
        s = 0
        while i:
            s += self.tree[i]
            i -= i & -i
        return s

    def pre(self, l, r):
        """查询区间[l,r]的和"""
        return self.query(r) - self.query(l - 1)

# 示例使用
n = 6
a = [4, 5, 6, 2, 1, 3]
# 查询格式：(操作类型, l, r)
# 操作类型1：在位置l加上r
# 操作类型2：查询区间[l,r]的和
que = [(1, 3, 5), (2, 1, 4), (1, 1, 9), (2, 2, 6)]
tr = BIT(a)
for op, l, r in que:
    if op == 1:
        tr.add(l, r)
    else:
        print(tr.pre(l, r))
```

### 线段树

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

### 树状数组(区间修改、区间求和)

```python
class BIT:
    """树状数组，支持区间修改和区间求和"""
    def __init__(self, n):
        self.tree = [0] * (n + 2)

    def add(self, i, val=1):
        """单点修改：在位置i加上val"""
        while i < len(self.tree):
            self.tree[i] += val
            i += i & -i

    def query(self, i):
        """前缀查询：查询前i个数的和"""
        s = 0
        while i:
            s += self.tree[i]
            i -= i & -i
        return s

    def pre(self, l, r):
        """区间查询：查询区间[l,r]的和"""
        return self.query(r) - self.query(l - 1)

# 示例使用：区间修改、区间求和
n, q = 5, 5
a = [0] + [1, 2, 3, 4, 5]
# 查询格式：(操作类型, l, r) 或 (操作类型, l, r, x)
# 操作类型1：区间[l,r]加上x
# 操作类型2：查询区间[l,r]的和
que = [(2, 1, 2), (1, 2, 3, 1), (2, 1, 3), (1, 1, 5, 1), (2, 1, 5)]

# 使用两个树状数组实现区间修改、区间求和
t1 = BIT(n + 1)
t2 = BIT(n + 1)
for i in range(1, n + 1):
    t1.add(i, a[i] - a[i - 1])
    t2.add(i, (a[i] - a[i - 1]) * i)

for i in range(q):
    s = que[i]
    op = s[0]
    if op == 1:
        l, r, x = s[1:]
        # 区间修改：[l,r]加上x
        t1.add(l, x)
        t1.add(r + 1, -x)
        t2.add(l, x * l)
        t2.add(r + 1, -x * (r + 1))
    else:
        l, r = s[1:]
        # 区间查询：[l,r]的和
        rs = t1.query(r) * (r + 1) - t2.query(r)
        ls = t1.query(l - 1) * l - t2.query(l - 1)
        print(rs - ls)
```

### 线段树(单点修改、区间查询最大值)

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

### Lazy线段树(区间更新)

```python
class Node:
    __slots__ = 'val', 'todo'

class LazySegmentTree:
    """Lazy线段树：支持区间更新和区间查询"""
    # 懒标记初始值
    _TODO_INIT = 0  # **根据题目修改**

    def __init__(self, arr, default=0):
        # 线段树维护一个长为 n 的数组（下标从 0 到 n-1）
        if isinstance(arr, int):
            arr = [default] * arr
        n = len(arr)
        self._n = n
        self._tree = [Node() for _ in range(2 << (n - 1).bit_length())]
        self._build(arr, 1, 0, n - 1)

    # 合并两个 val
    def _merge_val(self, a: int, b: int) -> int:
        return a + b  # **根据题目修改**

    # 合并两个懒标记
    def _merge_todo(self, a: int, b: int) -> int:
        return a + b  # **根据题目修改**

    # 把懒标记作用到 node 子树（本例为区间加）
    def _apply(self, node: int, l: int, r: int, todo: int) -> None:
        cur = self._tree[node]
        # 计算 tree[node] 区间的整体变化
        cur.val += todo * (r - l + 1)  # **根据题目修改**
        cur.todo = self._merge_todo(todo, cur.todo)

    # 把当前节点的懒标记下传给左右儿子
    def _spread(self, node: int, l: int, r: int) -> None:
        todo = self._tree[node].todo
        if todo == self._TODO_INIT:  # 没有需要下传的信息
            return
        m = (l + r) // 2
        self._apply(node * 2, l, m, todo)
        self._apply(node * 2 + 1, m + 1, r, todo)
        self._tree[node].todo = self._TODO_INIT  # 下传完毕

    # 合并左右儿子的 val 到当前节点的 val
    def _maintain(self, node: int) -> None:
        self._tree[node].val = self._merge_val(self._tree[node * 2].val, self._tree[node * 2 + 1].val)

    # 用 a 初始化线段树
    def _build(self, a, node, l, r):
        if l == r:  # 叶子
            self._tree[node].val = a[l]
            return
        m = (l + r) // 2
        self._build(a, node * 2, l, m)
        self._build(a, node * 2 + 1, m + 1, r)
        self._maintain(node)

    # 区间更新：把 [l,r] 的每个元素加上 val
    def range_update(self, l, r, val):
        self._update(1, 0, self._n - 1, l, r, val)

    def _update(self, node, nl, nr, l, r, val):
        if l <= nl and nr <= r:  # 完全包含
            self._apply(node, nl, nr, val)
            return
        self._spread(node, nl, nr)
        m = (nl + nr) // 2
        if l <= m:  # 左子树有重叠
            self._update(node * 2, nl, m, l, r, val)
        if r > m:  # 右子树有重叠
            self._update(node * 2 + 1, m + 1, nr, l, r, val)
        self._maintain(node)

    # 区间查询：查询 [l,r] 的结果
    def range_query(self, l, r):
        return self._query(1, 0, self._n - 1, l, r)

    def _query(self, node, nl, nr, l, r):
        if l <= nl and nr <= r:  # 完全包含
            return self._tree[node].val
        self._spread(node, nl, nr)
        m = (nl + nr) // 2
        if r <= m:  # 完全在左子树
            return self._query(node * 2, nl, m, l, r)
        if l > m:  # 完全在右子树
            return self._query(node * 2 + 1, m + 1, nr, l, r)
        # 跨越左右子树
        left_val = self._query(node * 2, nl, m, l, r)
        right_val = self._query(node * 2 + 1, m + 1, nr, l, r)
        return self._merge_val(left_val, right_val)

# 示例使用
arr = [1, 3, 2, 7, 9, 11]
st = LazySegmentTree(arr)
print("初始区间[1,4]的和:", st.range_query(1, 4))
st.range_update(1, 3, 5)  # 区间[1,3]每个元素加5
print("更新后区间[1,4]的和:", st.range_query(1, 4))
```

### ST表

```python
n = 5
a = [1, 2, 3, 4, 5]
que = [(1, 1), (1, 2), (1, 3), (3, 4), (2, 5)]  # 查询区间最大值
inf = float('inf')

# 预处理log2
bit = [0] * (n + 1)
for i in range(2, n + 1):
    bit[i] = bit[i >> 1] + 1

# 初始化ST表
st = [[-inf] * (bit[-1] + 1) for i in range(n + 1)]
for i, x in enumerate(a, 1):
    st[i][0] = x

# 预处理ST表
for j in range(1, bit[-1] + 1):
    for i in range(1, (n - (1 << j)) + 2):
        st[i][j] = max(st[i][j - 1], st[i + (1 << (j - 1))][j - 1])

# 查询区间最大值
for l, r in que:
    k = bit[r - l + 1]
    print(max(st[l][k], st[r - (1 << k) + 1][k]))
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

