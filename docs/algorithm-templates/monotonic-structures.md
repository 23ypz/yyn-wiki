---
tags:
  - yyn
  - 算法模板
---

# 单调数据结构
**算法介绍：**
单调数据结构是指维护元素单调性的数据结构，主要包括单调栈和单调队列。它们常用于解决寻找最近满足条件元素的问题。

**应用场景：**
- 寻找每个元素左边/右边第一个比它大/小的元素
- 滑动窗口最大值/最小值
- 矩形面积计算

### 单调栈

```python
def get(nums):
    n = len(nums)
    # left[i] 是 nums[i] 左侧最近的严格大于 nums[i] 的数的下标，若不存在则为 -1
    left = [-1] * n
    st = []  # 单调递减栈
    for i, x in enumerate(nums):
        while st and nums[st[-1]] <= x:  # 如果求严格小于，改成 >=
            st.pop()
        if st:
            left[i] = st[-1]
        st.append(i)

    # right[i] 是 nums[i] 右侧最近的严格大于 nums[i] 的数的下标，若不存在则为 n
    right = [n] * n
    st = []  # 清空栈，重新使用
    for i in range(n - 1, -1, -1):
        x = nums[i]
        while st and nums[st[-1]] <= x:
            st.pop()
        if st:
            right[i] = st[-1]
        st.append(i)

    return left, right


# 示例使用
a = [3, 1, 2, 5, 4]
left, right = get(a)
print(left)   # [-1, 0, 1, -1, 3]
print(right)  # [3, 3, 3, 5, 3]
```

### 单调队列

```python
# 计算 nums 的每个长为 k 的窗口的最大值
# 时间复杂度 O(n)，其中 n 是 nums 的长度
from collections import deque

def maxSlidingWindow(nums, k: int):
    """滑动窗口最大值"""
    ans = [0] * (len(nums) - k + 1)  # 窗口个数
    q = deque()  # 双端队列

    for i, x in enumerate(nums):
        # 1. 右边入
        while q and nums[q[-1]] <= x:
            q.pop()  # 维护 q 的单调性
        q.append(i)  # 注意保存的是下标，这样下面可以判断队首是否离开窗口

        # 2. 左边出
        left = i - k + 1  # 窗口左端点
        if q[0] < left:  # 队首离开窗口
            q.popleft()

        # 3. 在窗口左端点处记录答案
        if left >= 0:
            # 由于队首到队尾单调递减，所以窗口最大值就在队首
            ans[left] = nums[q[0]]

    return ans

# 示例使用
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
print(maxSlidingWindow(nums, k))  # [3, 3, 5, 5, 6, 7]
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

