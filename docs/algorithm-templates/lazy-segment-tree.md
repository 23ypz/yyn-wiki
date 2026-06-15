# Lazy 线段树

Lazy 线段树用于处理区间更新。如果没有懒标记，一次区间修改可能要递归到大量叶子节点；有了懒标记，完整覆盖的区间可以先整体记录，之后需要深入时再下传。

## 原理详解

如果当前节点维护区间 \([l,r]\)，区间整体加上 `todo`，那么区间和增加：

\[
todo\cdot(r-l+1)
\]

这时不必立刻修改所有子节点，只要在当前节点记录 `todo`。当后续查询或修改需要访问它的子区间时，再调用 `_spread` 把标记下传给左右儿子。

Lazy 线段树的核心函数通常有三个：

- `_apply`：把一个标记作用到当前节点；
- `_spread`：把当前节点标记下传给左右儿子；
- `_maintain`：用左右儿子的值重新维护当前节点。

## 代码模板

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

## 易错点

- 区间加、区间赋值、区间取 max 等操作的懒标记合并方式不同。
- 递归访问子节点前必须先下传懒标记。
- `_apply` 要同时改节点值和懒标记。
