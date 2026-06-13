---
tags:
  - yyn
  - 算法模板
---

# 堆
**算法介绍：**
堆是一种特殊的树形数据结构，满足堆序性质。Python中的heapq模块提供了堆操作的实现。

**应用场景：**
- 优先队列
- Top K问题
- 堆排序
- Dijkstra算法

### 对顶堆（查找中位数）

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

### 懒删除堆

```python
from collections import defaultdict
from heapq import heappop, heappush

class LazyHeap:
    """支持删除任意元素的懒删除堆"""
    def __init__(self):
        self.heap = []  # 最小堆（最大堆可以把数字取反或重载 __lt__）
        self.remove_cnt = defaultdict(int)  # 每个元素剩余需要删除的次数
        self.size = 0  # 堆的实际大小

    def remove(self, x) -> None:
        """删除元素x（懒删除）"""
        self.remove_cnt[x] += 1  # 懒删除
        self.size -= 1

    def _apply_remove(self) -> None:
        """正式执行删除操作，清理堆顶的已删除元素"""
        while self.heap and self.remove_cnt[self.heap[0]] > 0:
            self.remove_cnt[self.heap[0]] -= 1
            heappop(self.heap)

    def top(self):
        """查看堆顶元素"""
        self._apply_remove()
        return self.heap[0]  # 真正的堆顶

    def pop(self):
        """出堆"""
        self._apply_remove()
        self.size -= 1
        return heappop(self.heap)

    def push(self, x) -> None:
        """入堆"""
        if self.remove_cnt[x] > 0:
            self.remove_cnt[x] -= 1  # 抵消之前的删除
        else:
            heappush(self.heap, x)
        self.size += 1

# 示例使用
heap = LazyHeap()
heap.push(3)
heap.push(1)
heap.push(4)
heap.remove(1)  # 删除元素1
print("堆顶元素:", heap.top())  # 输出3
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

