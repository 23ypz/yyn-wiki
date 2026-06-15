---
tags:
  - yyn
  - 算法模板
  - 二分
---

# 基础二分

基础二分用于在有序数组中快速定位一个边界位置。最常见的问题是：

!!! example "例题：查找第一个不小于目标值的位置"
    给定一个升序数组 `a` 和目标值 `target`，求数组中第一个满足 `a[i] >= target` 的下标。如果不存在这样的元素，返回 `n`。

这个问题看似简单，但边界处理很容易出错。推荐使用“左右开区间”写法，它的优点是边界统一、循环条件清晰、不容易死循环。

## 核心不变量

令 `l=-1`，`r=n`，维护下面的不变量：

$$
a[l] < target, \qquad a[r] \ge target
$$

这里的 `l=-1` 和 `r=n` 是两个虚拟边界：

- `l=-1` 表示答案左侧的虚拟位置，一定不满足条件；
- `r=n` 表示答案右侧的虚拟位置，一定满足“越界意义下的条件”。

真正还没有确定的搜索范围是开区间：

$$
(l,r)
$$

每次取：

$$
mid = \left\lfloor\frac{l+r}{2}\right\rfloor
$$

如果 `a[mid] >= target`，说明 `mid` 已经满足条件，答案可能是 `mid` 或更靠左，所以令 `r=mid`。

如果 `a[mid] < target`，说明 `mid` 以及它左边一部分都不能成为答案，所以令 `l=mid`。

当 `l + 1 == r` 时，开区间中没有未确定元素，此时 `r` 就是第一个满足条件的位置。

## 图示：查找第一个大于等于 5 的位置

下面用数组 `[1,2,3,4,5,6,7]` 演示查找第一个 `>= 5` 的位置。

<div class="yyn-carousel" tabindex="0" aria-label="基础二分过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：初始化 l=-1，r=n，答案位于开区间 (l,r) 中。"><img src="../../assets/images/basic/binary-basic-step-1.svg" alt="基础二分第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：mid=3，a[3]=4 小于 5，令 l=mid。"><img src="../../assets/images/basic/binary-basic-step-2.svg" alt="基础二分第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：mid=5，a[5]=6 大于等于 5，令 r=mid。"><img src="../../assets/images/basic/binary-basic-step-3.svg" alt="基础二分第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：mid=4，a[4]=5 大于等于 5，令 r=mid；最终 r=4。"><img src="../../assets/images/basic/binary-basic-step-4.svg" alt="基础二分第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 4</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：初始化 l=-1，r=n，答案位于开区间 (l,r) 中。</div>
</div>

## 代码模板

下面保留你原来的模板风格。

```python
# 手写二分

# 找到第一个 >= tar 的数对应的下标
a = [1, 2, 3, 4, 5, 6, 7]
n = len(a)
tar = 5

# 左右开区间 (l, r)
# 实际闭区间为 [l + 1, r - 1]
l, r = -1, n
while l + 1 < r:
    mid = (l + r) >> 1  # 位运算优化，等价于 (l + r) // 2
    if a[mid] >= tar:
        r = mid
    else:
        l = mid

print(r)  # 输出第一个大于等于 target 的下标


# 内置库函数用法
from bisect import bisect_left, bisect_right

# 返回第一个 >= tar 的数对应的下标
idx1 = bisect_left(a, tar)
print(idx1)

# 返回第一个 > tar 的数对应的下标
idx2 = bisect_right(a, tar)
print(idx2)
```

## 为什么 `bisect_left` 对应第一个大于等于

`bisect_left(a, x)` 返回的是把 `x` 插入到数组中后，仍能保持有序的最靠左位置。这个位置左边的元素都满足：

$$
a[i] < x
$$

这个位置右边的元素都满足：

$$
a[i] \ge x
$$

所以它正好是“第一个大于等于 `x` 的位置”。

## 复杂度

每次循环把区间长度减半，因此时间复杂度为：

$$
O(\log n)
$$

空间复杂度为：

$$
O(1)
$$

## 易错点

- `l` 和 `r` 的含义必须始终保持不变。
- 使用开区间模板时，循环条件是 `l + 1 < r`。
- 如果找第一个 `> target`，用 `bisect_right` 或把判断改成 `a[mid] > target`。
- 如果数组不是有序的，基础二分没有意义。
