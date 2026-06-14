---
tags:
  - yyn
  - 算法模板
  - 数学
---

# 最小公倍数

## 定义

两个整数 $a,b$ 的最小公倍数记作：

$$
\operatorname{lcm}(a,b)
$$

它表示同时是 $a$ 和 $b$ 的倍数的最小正整数。

## 与最大公约数的关系

最大公约数和最小公倍数满足：

$$
\gcd(a,b) \times \operatorname{lcm}(a,b)=|a\times b|
$$

所以：

$$
\operatorname{lcm}(a,b)=\frac{|a\times b|}{\gcd(a,b)}
$$

实际写代码时，通常先除后乘：

$$
\operatorname{lcm}(a,b)=\frac{a}{\gcd(a,b)}\times b
$$

这样可以降低中间结果溢出的风险。

## 例题

!!! example "例题：求两个数的最小公倍数"
    给定两个正整数 $a,b$，求它们的最小公倍数。

    例如 $a=6,b=8$，答案为 $24$。

## 实现

```python
def gcd(a, b):
    """欧几里得算法求最大公约数"""
    while b:
        a, b = b, a % b
    return a


def lcm(a, b):
    """最小公倍数"""
    return (a // gcd(a, b)) * b

print(lcm(6, 8))
```

## 复杂度

主要开销来自一次最大公约数计算。

- 时间复杂度：$O(\log \min(a,b))$
- 空间复杂度：$O(1)$

## 易错点

- 如果 $a$ 或 $b$ 为 $0$，最小公倍数通常定义为 $0$。
- 计算时建议先除后乘，避免中间乘积过大。
- 多个数的最小公倍数也可以从左到右依次合并。
