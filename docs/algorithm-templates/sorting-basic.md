---
tags:
  - yyn
  - 算法模板
  - 排序
---

# 简单排序

Python 的 `list.sort()` 和 `sorted()` 都使用稳定排序。稳定的意思是：如果两个元素排序关键字相同，它们在排序后的相对顺序和排序前相同。

!!! example "例题：按多关键字排序"
    给定若干二元组 `(x, y)`，先按 `y` 升序排序，如果 `y` 相同，再按 `x` 升序排序。

这个例题可以直接用元组作为 `key`：

$$
key((x,y))=(y,x)
$$

Python 会先比较元组第一项，如果第一项相同，再比较第二项。

## 图示：key 如何改变排序规则

<div class="yyn-carousel" tabindex="0" aria-label="排序 key 过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：原始数据，默认排序会按元组字典序比较。"><img src="../../assets/images/basic/sorting-key-step-1.svg" alt="排序 key 第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：key=(第二维, 第一维) 可以实现多关键字排序。"><img src="../../assets/images/basic/sorting-key-step-2.svg" alt="排序 key 第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：对数值取负，可以把某个关键字改成降序。"><img src="../../assets/images/basic/sorting-key-step-3.svg" alt="排序 key 第 3 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 3</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：原始数据，默认排序会按元组字典序比较。</div>
</div>

## 代码模板

下面保留你原来的模板风格。

```python
a = [1, 2, 3, 4, 5, 6]

# 直接将数组 a 升序排序
a.sort()

# 直接将数组 a 降序排序
a.sort(reverse=True)

b = [(1, 2), (2, 3), (1, 7), (2, 6), (0, 3)]

# 默认先按第一个值升序排序，第一个值相同的情况下按第二个值升序排序
b.sort()

# key 关键字自定义排序
# 先按第二个值升序排序，再按第一个值升序排序
b.sort(key=lambda x: (x[1], x[0]))

# 先按第二个值降序排序，再按第一个值升序排序
b.sort(key=lambda x: -x[1])

# 不修改原数组的排序写法（将排序后的数组赋值给一个新数组）
c = sorted(b)  # 如要自定义排序，写法和 sort 一样

print("排序结果:", b)
print("新数组:", c)
```

## `sort` 和 `sorted` 的区别

`a.sort()` 会原地修改列表 `a`，没有返回新的列表。

`sorted(a)` 不修改原列表，而是返回一个新的有序列表。

所以如果你还需要保留原数组，应该使用：

```python
b = sorted(a)
```

## 多关键字排序

如果排序规则有多个关键字，推荐写成元组：

```python
items.sort(key=lambda x: (x[1], x[0]))
```

含义是：

1. 先比较 `x[1]`；
2. 如果 `x[1]` 相同，再比较 `x[0]`。

如果某一维需要降序，可以对数值取负：

```python
items.sort(key=lambda x: (-x[1], x[0]))
```

## 复杂度

Python 排序的时间复杂度通常记为：

$$
O(n\log n)
$$

空间复杂度与实现有关，通常可以认为需要额外空间。

## 易错点

- `a.sort()` 返回值是 `None`，不要写 `a = a.sort()`。
- `reverse=True` 会让整个排序结果反转，不适合“某一维降序、另一维升序”的情况。
- 多关键字排序优先使用元组 `key`，比自定义比较函数更简洁。
