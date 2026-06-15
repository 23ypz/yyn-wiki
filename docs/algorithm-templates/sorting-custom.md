---
tags:
  - yyn
  - 算法模板
  - 自定义排序
---

# 自定义排序

当排序规则不能简单写成 `key` 时，可以使用 `functools.cmp_to_key` 把比较函数转换成排序关键字。

比较函数 `cmp(a,b)` 的约定是：

- 返回负数：`a` 排在 `b` 前面；
- 返回正数：`a` 排在 `b` 后面；
- 返回 0：二者在当前规则下相等。

## 模板代码：基础比较函数

下面保留你原来的模板风格。

```python
from functools import cmp_to_key


def cmp(a, b):
    """
    :param a: 待排序的数 a
    :param b: 待排序的数 b
    :return: 返回 1 表示 a 要排在 b 的右边，返回 -1 表示 a 要排在 b 的左边
    """
    if a > b:
        return 1
    if a < b:
        return -1
    return 0


a = [1, 2, 3, 4, 7, 2]

a.sort(key=cmp_to_key(cmp))
print("自定义排序结果:", a)
```

这段代码等价于普通升序排序，只是展示了 `cmp_to_key` 的用法。

## 经典例题：拼接最大数

!!! example "例题：拼接最大数"
    给定若干非负整数，把它们重新排列后拼接成一个字符串，使得最终结果最大。

例如：

```text
[3, 30, 34, 5, 9]
```

最优排列是：

```text
9 5 34 3 30
```

答案为：

```text
9534330
```

这个问题不能只按数字大小排序。比如 `3` 和 `30`，虽然 `30 > 3`，但拼接时：

$$
330 > 303
$$

所以 `3` 应该排在 `30` 前面。

## 代码模板：拼接最大数

```python
from functools import cmp_to_key


def cmp(a, b):
    """如果 a+b 更大，则 a 应该排在 b 前面。"""
    if a + b > b + a:
        return -1
    if a + b < b + a:
        return 1
    return 0


nums = [3, 30, 34, 5, 9]
arr = list(map(str, nums))
arr.sort(key=cmp_to_key(cmp))

ans = ''.join(arr)
# 如果全是 0，结果应该是 "0"，而不是 "000"
if ans[0] == '0':
    ans = '0'

print(ans)  # 9534330
```

## 为什么比较 `a+b` 和 `b+a`

对于任意两个字符串数字 `a` 和 `b`，在最终拼接结果里，它们相邻时只有两种顺序：

$$
ab \quad \text{或} \quad ba
$$

如果 `ab > ba`，那么把 `a` 放在 `b` 前面一定不差；如果 `ab < ba`，则应该把 `b` 放在 `a` 前面。

局部比较规则确定后，排序就能得到整体最大的拼接结果。

## 易错点

- `cmp_to_key` 的比较函数返回值方向不要写反。
- 自定义比较函数应尽量满足传递性，否则排序结果可能不稳定或不符合预期。
- 能用 `key` 解决时优先用 `key`，只有规则依赖两个元素的相对关系时才用 `cmp_to_key`。
