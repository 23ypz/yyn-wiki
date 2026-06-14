---
tags:
  - yyn
  - 算法模板
  - 数学
---

# 矩阵快速幂

## 定义

矩阵快速幂用于快速计算矩阵的高次幂：

$$
A^k
$$

它和普通快速幂的思想一致，只是把普通乘法换成了矩阵乘法。

## 适用场景

当一个序列满足线性递推关系时，经常可以写成矩阵形式。例如 Fibonacci 数列：

$$
F_n=F_{n-1}+F_{n-2}
$$

可以写成：

$$
\begin{bmatrix}
F_n \\
F_{n-1}
\end{bmatrix}
=
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}
\begin{bmatrix}
F_{n-1} \\
F_{n-2}
\end{bmatrix}
$$

进一步得到：

$$
\begin{bmatrix}
F_n \\
F_{n-1}
\end{bmatrix}
=
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}^{n-2}
\begin{bmatrix}
F_2 \\
F_1
\end{bmatrix}
$$

## 例题

!!! example "例题：快速求 Fibonacci 数列第 n 项"
    给定 $n$，求 $F_n \bmod (10^9+7)$。

    当 $n$ 很大时，例如 $10^9$，普通递推 $O(n)$ 无法接受，可以使用矩阵快速幂。

## 实现

```python
mod = 10 ** 9 + 7


def mul(a, b):
    """矩阵乘法"""
    n1, m1 = len(a), len(a[0])
    n2, m2 = len(b), len(b[0])
    c = [[0] * m2 for _ in range(n1)]
    for i in range(n1):
        for j in range(m2):
            for k in range(m1):
                c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % mod
    return c


def ksm(a, b, ns):
    """矩阵快速幂"""
    res = [[1 if i == j else 0 for i in range(ns)] for j in range(ns)]
    while b:
        if b & 1:
            res = mul(res, a)
        a = mul(a, a)
        b >>= 1
    return res


n = 1000000000
mat = [[1, 1], [1, 0]]
res = ksm(mat, n - 2, 2)
print((res[0][0] + res[0][1]) % mod)
```

## 复杂度

设矩阵大小为 $s \times s$，指数为 $k$。

- 单次矩阵乘法复杂度：$O(s^3)$
- 快速幂需要 $O(\log k)$ 次乘法
- 总时间复杂度：$O(s^3 \log k)$
- 空间复杂度：$O(s^2)$

## 易错点

- 单位矩阵是矩阵乘法中的“1”，不能用普通数字 `1` 代替。
- 矩阵乘法不满足交换律，一般有 $AB \ne BA$。
- Fibonacci 的初始项定义不同，矩阵幂的指数也会不同，需要根据题目调整。
