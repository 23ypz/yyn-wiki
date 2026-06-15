# 树状数组：区间修改与区间求和

普通树状数组可以做“单点修改、区间查询”。如果需要“区间修改、区间查询”，可以借助差分数组和两个树状数组实现。

## 原理详解

设差分数组为 \(d\)，则：

\[
a_i=\sum_{j=1}^{i}d_j
\]

要求前缀和：

\[
\sum_{i=1}^{x}a_i
=\sum_{i=1}^{x}\sum_{j=1}^{i}d_j
\]

交换求和顺序，\(d_j\) 会出现在 \(a_j,a_{j+1},\ldots,a_x\) 中，一共出现 \(x-j+1\) 次，因此：

\[
\sum_{i=1}^{x}a_i=\sum_{j=1}^{x}(x-j+1)d_j
\]

拆开得到：

\[
(x+1)\sum_{j=1}^{x}d_j-\sum_{j=1}^{x}j d_j
\]

所以维护两个树状数组：一个维护 \(d_j\)，另一个维护 \(j d_j\)。区间加 \([l,r]\) 本质是在差分上做：

\[
d_l += v,\quad d_{r+1} -= v
\]

## 代码模板

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

## 易错点

- 前缀公式是 `(x+1)*sum(d)-sum(i*d[i])`，不是 `x*sum(d)`。
- 区间修改时要在 `r+1` 处撤销影响。
- 初始数组也要先转成差分加入两个树状数组。
