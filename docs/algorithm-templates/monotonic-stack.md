# 单调栈

单调栈用于寻找每个元素左侧或右侧第一个比它大或小的元素。它的核心是维护栈内元素的单调性，让不可能成为答案的元素提前出栈。

## 例题：左右最近更大元素

!!! example "例题"
    给定数组 `nums`，对每个位置 `i`，求它左侧和右侧最近的严格大于 `nums[i]` 的元素下标。

## 原理详解

以“左侧最近更大元素”为例，维护一个单调递减栈，栈里存下标。处理当前元素 `x` 时，如果栈顶元素 `<= x`，那么栈顶既不能成为当前元素的左侧更大值，也不能成为后续元素的左侧最近更大值，因此可以弹出。

弹栈结束后：

- 如果栈不为空，栈顶就是当前元素左侧最近的严格更大元素；
- 如果栈为空，说明左侧不存在更大元素。

每个下标最多入栈一次、出栈一次，所以总复杂度是线性的。

## 图示：维护过程

<div class="yyn-carousel" tabindex="0" aria-label="单调栈过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：读入 3，直接入栈。"><img src="../../assets/images/data-structures/monotonic-stack-step-1.svg" alt="单调栈第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：读入 1，栈顶 3 更大。"><img src="../../assets/images/data-structures/monotonic-stack-step-2.svg" alt="单调栈第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：读入 2，弹出 1。"><img src="../../assets/images/data-structures/monotonic-stack-step-3.svg" alt="单调栈第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：读入 5，弹出 2 和 3。"><img src="../../assets/images/data-structures/monotonic-stack-step-4.svg" alt="单调栈第 4 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 5 步：读入 4，左侧最近更大值是 5。"><img src="../../assets/images/data-structures/monotonic-stack-step-5.svg" alt="单调栈第 5 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 5</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：读入 3，直接入栈。</div>
</div>

## 代码模板

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

## 复杂度

每个元素最多入栈一次、出栈一次，时间复杂度为 \(O(n)\)。

## 易错点

- 严格更大和非严格更大对应的弹栈条件不同。
- 通常存下标比存值更方便，因为答案常常需要位置。
- 从左往右求左侧信息，从右往左求右侧信息。
