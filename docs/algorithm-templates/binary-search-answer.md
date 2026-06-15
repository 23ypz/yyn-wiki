---
tags:
  - yyn
  - 算法模板
  - 二分答案
---

# 二分答案

二分答案不是在数组中二分，而是在“可能的答案范围”上二分。它的核心前提是：存在一个关于答案的单调判断函数 `check(x)`。

!!! example "例题：最大化最小距离"
    给定若干个位置 `pos`，要求选出 `k` 个位置，使得任意相邻已选位置之间的最小距离尽量大。求这个最大距离。

如果给定一个距离 `d`，我们可以贪心判断是否能选出 `k` 个位置，并且相邻距离都至少为 `d`。如果 `d` 可行，那么比 `d` 更小的距离也一定可行，因此可行性呈现：

$$
TTTTTTFFFFF
$$

这时要找最后一个 `True`。

## 两种常见单调模型

### 最大化最小值

这种问题通常是：答案越小越容易满足，答案越大越难满足。

可行性形如：

$$
TTTTTTTFFFFFF
$$

目标是找最后一个满足条件的位置，也就是最大可行值。

### 最小化最大值

这种问题通常是：答案越小越难满足，答案越大越容易满足。

可行性形如：

$$
FFFFFFFTTTTTT
$$

目标是找第一个满足条件的位置，也就是最小可行值。

## 图示：二分的不是数组，而是答案空间

<div class="yyn-carousel" tabindex="0" aria-label="二分答案单调性手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：最大化最小值时，check(x) 通常是前面 True、后面 False。"><img src="../../assets/images/basic/binary-answer-step-1.svg" alt="二分答案第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：若 check(mid)=True，说明答案还能尝试变大。"><img src="../../assets/images/basic/binary-answer-step-2.svg" alt="二分答案第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：若 check(mid)=False，说明答案太大，需要缩小右边界。"><img src="../../assets/images/basic/binary-answer-step-3.svg" alt="二分答案第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：最小化最大值时，check(x) 通常是前面 False、后面 True。"><img src="../../assets/images/basic/binary-answer-step-4.svg" alt="二分答案第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 4</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：最大化最小值时，check(x) 通常是前面 True、后面 False。</div>
</div>

## 模板一：最大化最小值

下面是一个完整可运行的例子：从若干位置中选 `k` 个，使得相邻已选位置的最小距离最大。

```python
# 最大化最小距离

pos = [1, 2, 4, 8, 9]
k = 3
pos.sort()


def check(d):
    """判断是否能选出 k 个点，使得相邻距离至少为 d。"""
    cnt = 1
    last = pos[0]
    for x in pos[1:]:
        if x - last >= d:
            cnt += 1
            last = x
    return cnt >= k


# check(d) 形如 TTTTTFFFFF
# 找最后一个 True
l, r = 0, pos[-1] - pos[0] + 1
while l + 1 < r:
    mid = (l + r) >> 1
    if check(mid):
        l = mid
    else:
        r = mid

print(l)  # 3
```

这段代码和你原来的“最大化最小值”模板一致：当 `check(mid)` 为真时，说明当前答案可行，可以继续尝试更大的答案，所以移动左边界。

## 模板二：最小化最大值

下面是一个完整可运行的例子：把数组分成不超过 `k` 段，最小化每段和的最大值。

```python
# 最小化最大段和

nums = [7, 2, 5, 10, 8]
k = 2


def check(mx):
    """判断是否能把数组分成不超过 k 段，使得每段和都不超过 mx。"""
    cnt = 1
    cur = 0
    for x in nums:
        if cur + x <= mx:
            cur += x
        else:
            cnt += 1
            cur = x
    return cnt <= k


# check(mx) 形如 FFFFFTTTTT
# 找第一个 True
l, r = max(nums) - 1, sum(nums)
while l + 1 < r:
    mid = (l + r) >> 1
    if check(mid):
        r = mid
    else:
        l = mid

print(r)  # 18
```

这类问题的 `check(mx)` 表示“最大限制为 `mx` 时能不能完成”。限制越大越容易完成，因此单调性是 `False` 到 `True`。

## 如何判断能不能二分答案

如果你能定义一个判断函数 `check(x)`，并且随着 `x` 增大，判断结果只发生一次变化，那么就可以二分答案。

常见判断方式：

- 贪心判断是否能放下、能分配、能覆盖；
- 前缀和判断区间是否满足限制；
- BFS / DFS 判断某个阈值下是否连通；
- DP 判断某个限制下是否可行。

## 易错点

- 二分答案前必须先证明或直觉确认 `check` 是单调的。
- `l` 和 `r` 要根据模板含义初始化，不能随便写。
- 最大化最小值通常返回 `l`，最小化最大值通常返回 `r`。
- `check` 本身如果写错，二分模板再正确也没用。
