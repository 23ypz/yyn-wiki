# 对顶堆

对顶堆用于动态维护中位数。它把所有数字分成两半：较小的一半放在大顶堆中，较大的一半放在小顶堆中。

## 例题：数据流中位数

!!! example "例题"
    不断插入数字，每次插入后查询当前中位数。

## 原理详解

设小顶堆 `A` 保存较大的一半，大顶堆 `B` 保存较小的一半。Python 没有大顶堆，所以 `B` 里存相反数。

需要维护两个条件：

\[
\max(B) \le \min(A)
\]

以及两个堆大小尽量平衡：

\[
|\,|A|-|B|\,|\le 1
\]

如果元素总数为奇数，中位数就是元素较多那一边的堆顶；如果元素总数为偶数，中位数就是两个堆顶的平均值。插入时先放入一边，再把不属于这一边的堆顶转移到另一边，从而保持有序分割。

## 代码模板

```python
from heapq import *

class MedianFinder:
    """使用对顶堆维护中位数"""
    def __init__(self):
        self.A = []  # 小顶堆，保存较大的一半
        self.B = []  # 大顶堆，保存较小的一半

    def addNum(self, num: int) -> None:
        """添加数字"""
        if len(self.A) != len(self.B):
            heappush(self.A, num)
            heappush(self.B, -heappop(self.A))
        else:
            heappush(self.B, -num)
            heappush(self.A, -heappop(self.B))

    def findMedian(self) -> float:
        """查找中位数"""
        return self.A[0] if len(self.A) != len(self.B) else (self.A[0] - self.B[0]) / 2.0

# 示例使用
mf = MedianFinder()
for num in [1, 2, 3, 4, 5]:
    mf.addNum(num)
    print(mf.findMedian())
```

## 易错点

- 大顶堆用负数实现，取值时要取反。
- 插入后要保证两个堆大小平衡。
- 两个堆不仅要大小平衡，还要满足左半部分不大于右半部分。
