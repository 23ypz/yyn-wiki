---
tags:
  - yyn
  - 算法模板
  - 数学
---

# 质因数分解

## 定义

质因数分解是把一个正整数写成若干质数幂的乘积：

$$
n=p_1^{e_1}p_2^{e_2}\cdots p_k^{e_k}
$$

其中 $p_i$ 是互不相同的质数，$e_i$ 是对应的指数。

## 试除法

最直接的方法是从 $2$ 开始试除。如果 $i$ 能整除 $n$，就不断除掉 $i$，统计指数。

只需要试到：

$$
i^2 \le n
$$

如果循环结束后 $n>1$，说明剩下的 $n$ 本身就是一个质数。

## 例题

!!! example "例题：分解一个整数"
    给定正整数 $n$，输出它的所有质因子及其指数。

    例如：

    $$
    60=2^2\times 3^1\times 5^1
    $$

## 实现

```python
# 法一：试除法，时间复杂度 O(√n)
def get_fac(n):
    fac = []
    i = 2
    while i * i <= n:
        if n % i == 0:
            e = 0
            while n % i == 0:
                e += 1
                n //= i
            fac.append((i, e))
        i += 1
    if n > 1:
        fac.append((n, 1))
    return fac

print(get_fac(60))
```

## 多次分解优化

如果要分解很多个不超过 $N$ 的数，可以预处理最小质因子 `lpf`。

```python
mx = 10 ** 5 + 1
lpf = [0] * mx

for i in range(2, mx):
    if lpf[i] == 0:
        for j in range(i, mx, i):
            if lpf[j] == 0:
                lpf[j] = i


def get_fac2(x):
    """O(log x) 时间分解质因数"""
    res = []
    while x > 1:
        p = lpf[x]
        e = 1
        x //= p
        while x % p == 0:
            e += 1
            x //= p
        res.append((p, e))
    return res

print(get_fac2(60))
```

## 复杂度

- 单次试除法：$O(\sqrt n)$
- 预处理最小质因子后，单次分解通常接近 $O(\log n)$
- 最小质因子数组空间复杂度：$O(N)$

## 易错点

- 试除过程中 `n` 会变小，因此循环条件应该写成 `i * i <= n`。
- 最后如果 `n > 1`，一定要把它作为质因子加入答案。
- 预处理 `lpf` 时，数组上限要覆盖所有可能被分解的数。
