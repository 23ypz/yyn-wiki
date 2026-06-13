---
tags:
  - yyn
  - 算法模板
---

# 二分
**算法介绍：**
二分查找是一种高效的搜索算法，时间复杂度为O(log n)。它通过不断将搜索区间减半来快速定位目标值的位置。二分查找要求数组必须是有序的。

**应用场景：**
- 在有序数组中查找特定元素
- 查找满足某种条件的最小值或最大值
- 优化某些问题的解法，将线性搜索优化为对数搜索

### 基础二分

```python
# 手写二分

# 找到第一个 >= tar的数对应的下标
a = [1,2,3,4,5,6,7]
n = len(a)
tar = 5
# 左右开区间(l,r)
# 实际闭区间为[l + 1,r - 1]
l,r = -1,n
while l + 1 < r:
    mid = (l + r) >> 1  # 位运算优化，等价于 (l + r) // 2
    if a[mid] >= tar:
        r = mid
    else:
        l = mid
print(r)  # 输出第一个大于等于target的下标


# 内置库函数用法
from bisect import bisect_left,bisect_right
# 返回第一个 >= tar的数对应的下标
idx1 = bisect_left(a,tar)
print(idx1)

# 返回第一个 > tar的数对应的下标
idx2 = bisect_right(a,tar)
print(idx2)
```

### 二分答案

```python
# 手写二分答案

'''
答案分布类似于 TTTTTTTTTTTFFFFFFFFFFFFFFFF
答案越小越满足题意
此时需要我们最大化最小值
'''

a = [1,2,3,3,4,5,6,7]
n = len(a)
def check1(mx):
    # 检查函数，根据具体题目实现
    pass
# 上限根据题目修改
l,r = -1,10 ** 18
while l + 1 < r:
    mid = (l + r) >> 1
    if check1(mid):
        # 如果满足条件，说明答案还可能更大
        l = mid
    else:
        r = mid
print(l)  # 输出最大满足条件的值




'''
答案分布类似于 FFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTT
答案越大越满足题意
此时需要我们最小化最大值
'''

a = [1,2,3,3,4,5,6,7]
n = len(a)
def check2(mx):
    # 检查函数，根据具体题目实现
    pass
# 上限根据题目修改
l,r = -1,10 ** 18
while l + 1 < r:
    mid = (l + r) >> 1
    if check2(mid):
        # 如果满足条件，说明答案还可能更小
        r = mid
    else:
        l = mid
print(r)  # 输出最小满足条件的值
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

