# 懒删除堆

普通堆只能高效删除堆顶，不能在 \(O(\log n)\) 内删除任意元素。懒删除堆的思路是：删除请求先记录下来，等这个元素出现在堆顶时再真正删除。

## 原理详解

当要删除元素 `x` 时，不在堆数组中线性查找它，而是记录：

\[
remove\_cnt[x] \leftarrow remove\_cnt[x]+1
\]

之后每次查看堆顶或弹出堆顶前，执行 `_apply_remove()`。如果堆顶元素已经被标记删除，就不断弹出，直到堆顶是一个真正存在的元素。

这种方法适合滑动窗口、对顶堆删除旧元素、动态多重集合等场景。因为每个元素最多被压入一次、真正弹出一次，所以总复杂度仍然可控。

## 代码模板

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

## 易错点

查询堆顶前一定要先清理堆顶的待删除元素，也就是调用 `_apply_remove()`。

## 易错点

- `size` 应表示逻辑大小，而不是堆数组长度。
- 查询堆顶前必须清理待删除元素。
- 如果用最大堆并存负数，`remove_cnt` 也要按堆里实际存储的值记录。
