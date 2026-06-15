# 树状数组

树状数组支持单点修改和前缀查询，最经典的用途是动态维护区间和。它比线段树更短，但适用范围也更窄：最适合能转化为前缀信息的问题。

## lowbit 与负责区间

树状数组的核心是：

\[
lowbit(x)=x\&(-x)
\]

`lowbit(i)` 表示 `i` 的二进制最低位的 1 所代表的值。`tree[i]` 负责的区间长度正是 `lowbit(i)`，具体区间是：

\[
[i-lowbit(i)+1,i]
\]

例如：

- `tree[6]` 负责 `[5,6]`，因为 `lowbit(6)=2`；
- `tree[8]` 负责 `[1,8]`，因为 `lowbit(8)=8`。

单点修改 `add(i,val)` 时，要更新所有包含位置 `i` 的树状数组节点，所以向上跳：

\[
i\leftarrow i+lowbit(i)
\]

前缀查询 `query(i)` 时，要把 `[1,i]` 拆成若干个不重叠的负责区间，所以向左跳：

\[
i\leftarrow i-lowbit(i)
\]

## 图示：更新与查询跳转

<div class="yyn-carousel" tabindex="0" aria-label="树状数组跳转过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：tree[i] 负责区间 [i-lowbit(i)+1,i]。"><img src="../../assets/images/data-structures/fenwick-step-1.svg" alt="树状数组第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：add(3,+5) 会更新 tree[3]、tree[4]、tree[8]。"><img src="../../assets/images/data-structures/fenwick-step-2.svg" alt="树状数组第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：query(6) 使用 tree[6] 和 tree[4] 拼出 [1,6]。"><img src="../../assets/images/data-structures/fenwick-step-3.svg" alt="树状数组第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：range_sum(3,6) = query(6) - query(2)。"><img src="../../assets/images/data-structures/fenwick-step-4.svg" alt="树状数组第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：tree[i] 负责区间 [i-lowbit(i)+1,i]。</div>
</div>

## 代码模板

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

## 易错点

- 树状数组通常使用 1-indexed。
- `add` 是向右上跳，`query` 是向左跳。
- `tree[i]` 不是原数组值，而是一段区间的汇总值。
