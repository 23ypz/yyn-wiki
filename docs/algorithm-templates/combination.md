---
tags:
  - yyn
  - 算法模板
  - 数学
---

# 组合数

## 定义

组合数表示从 $n$ 个不同元素中选出 $m$ 个元素的方案数，记作：

$$
\binom{n}{m}
$$

它的阶乘公式为：

$$
\binom{n}{m}=\frac{n!}{m!(n-m)!}
$$

组合数满足对称性：

$$
\binom{n}{m}=\binom{n}{n-m}
$$

所以实际计算时通常先令：

$$
m=\min(m,n-m)
$$

这样可以减少循环次数。

当 $m<0$ 或 $m>n$ 时，不存在合法选择方案，组合数为 $0$。

## 常见计算方式

不同场景下，组合数的计算方式不同。

如果有大量询问，并且所有 $n$ 的范围不大，通常使用“预处理阶乘 + 逆阶乘”，之后每次查询可以做到 $O(1)$。

如果只是少量询问，或者不想预处理，也可以使用下面两种写法：

- 杨辉三角 DP；
- 直接计算分子分母并取模。

下面分别说明。

---

## 写法一：预处理阶乘

设：

$$
fac[i]=i!
$$

再预处理逆阶乘：

$$
inv\_f[i]=(i!)^{-1}
$$

那么有：

$$
\binom{n}{m}=fac[n]\times inv\_f[m]\times inv\_f[n-m]\pmod p
$$

这里的除法被转化成了乘法逆元。若 $p$ 是质数，可以根据费马小定理得到：

$$
a^{-1}\equiv a^{p-2}\pmod p
$$

因此：

$$
(i!)^{-1}\equiv (i!)^{p-2}\pmod p
$$

### 适用场景

适合多次查询，例如给出很多组 $n,m$，每次都要求：

$$
\binom{n}{m}\bmod p
$$

只要预处理到最大 $n$，之后每次查询都是 $O(1)$。

### 实现

```python
mod = 1_000_000_007
mx = 100_001

# 预处理阶乘
fac = [0] * mx
fac[0] = 1
for i in range(1, mx):
    fac[i] = fac[i - 1] * i % mod

# 预处理逆阶乘
inv_f = [0] * mx
inv_f[-1] = pow(fac[-1], mod - 2, mod)
for i in range(mx - 1, 0, -1):
    inv_f[i - 1] = inv_f[i] * i % mod


def comb(n, m):
    """从 n 个数中选 m 个数的方案数"""
    return fac[n] * inv_f[m] * inv_f[n - m] % mod if 0 <= m <= n else 0

print(comb(6, 2))  # 15
```

### 复杂度

设预处理上限为 $N$。

- 预处理时间复杂度：$O(N)$
- 单次查询时间复杂度：$O(1)$
- 空间复杂度：$O(N)$

---

## 写法二：杨辉三角 DP

### 原理

组合数有一个非常重要的递推关系：

$$
\binom{n}{m}=\binom{n-1}{m}+\binom{n-1}{m-1}
$$

这个式子的含义可以从“第 $n$ 个元素选不选”来理解。

从 $n$ 个元素中选 $m$ 个，考虑最后一个元素：

- 不选第 $n$ 个元素，那么需要从前 $n-1$ 个元素中选 $m$ 个，方案数是：

$$
\binom{n-1}{m}
$$

- 选第 $n$ 个元素，那么还需要从前 $n-1$ 个元素中选 $m-1$ 个，方案数是：

$$
\binom{n-1}{m-1}
$$

两种情况互不重叠，所以总方案数相加：

$$
\binom{n}{m}=\binom{n-1}{m}+\binom{n-1}{m-1}
$$

边界条件是：

$$
\binom{i}{0}=1
$$

以及：

$$
\binom{i}{i}=1
$$

这正是杨辉三角的生成方式。

### 什么时候用 DP 写法

DP 写法不需要用到除法，也不需要求逆元，所以它对模数没有质数要求。也就是说，下面这种写法在任意模数下都成立。

适合场景：

- $n$ 不大；
- 只需要少量组合数；
- 模数不一定是质数；
- 不想预处理阶乘和逆阶乘。

### 二维 DP 实现

令：

$$
dp[i][j]=\binom{i}{j}
$$

根据递推式：

$$
dp[i][j]=dp[i-1][j]+dp[i-1][j-1]
$$

得到代码：

```python
def comb_dp_2d(n, m, mod):
    """使用杨辉三角 DP 计算 C(n,m) % mod"""
    if m < 0 or m > n:
        return 0

    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = 1
        for j in range(1, min(i, m) + 1):
            if j == i:
                dp[i][j] = 1
            else:
                dp[i][j] = (dp[i - 1][j] + dp[i - 1][j - 1]) % mod

    return dp[n][m]

print(comb_dp_2d(6, 2, 1_000_000_007))  # 15
```

### 一维 DP 优化

二维 DP 中，第 $i$ 行只依赖第 $i-1$ 行，所以可以压缩成一维数组。

令：

$$
dp[j]=\binom{当前处理到的 i}{j}
$$

转移仍然来自：

$$
dp[j]=dp[j]+dp[j-1]
$$

但是这里必须倒序枚举 $j$。原因是：当前的 $dp[j]$ 表示上一轮的 $\binom{i-1}{j}$，当前的 $dp[j-1]$ 也必须表示上一轮的 $\binom{i-1}{j-1}$。

如果正序枚举，$dp[j-1]$ 会先被当前轮更新，导致同一轮数据被重复使用。

```python
def comb_dp(n, m, mod):
    """使用一维杨辉三角 DP 计算 C(n,m) % mod"""
    if m < 0 or m > n:
        return 0

    m = min(m, n - m)
    dp = [0] * (m + 1)
    dp[0] = 1

    for i in range(1, n + 1):
        # j 不能超过当前 i，也不能超过目标 m
        for j in range(min(i, m), 0, -1):
            dp[j] = (dp[j] + dp[j - 1]) % mod

    return dp[m]

print(comb_dp(6, 2, 1_000_000_007))  # 15
```

### 复杂度

设要求 $\binom{n}{m}$。

- 二维 DP 时间复杂度：$O(nm)$
- 二维 DP 空间复杂度：$O(nm)$
- 一维 DP 时间复杂度：$O(nm)$
- 一维 DP 空间复杂度：$O(m)$

由于通常会先令 $m=\min(m,n-m)$，所以实际循环次数会更少。

---

## 写法三：直接计算分子分母

### 原理

根据组合数公式：

$$
\binom{n}{m}=\frac{n!}{m!(n-m)!}
$$

可以约去一部分阶乘，得到：

$$
\binom{n}{m}=\frac{(n-m+1)(n-m+2)\cdots n}{1\cdot 2\cdot \cdots m}
$$

也就是：

$$
\binom{n}{m}=\frac{\prod_{i=1}^{m}(n-m+i)}{\prod_{i=1}^{m}i}
$$

如果需要对质数 $p$ 取模，不能直接做除法，需要把分母变成逆元：

$$
\frac{A}{B}\bmod p=A\times B^{-1}\bmod p
$$

当 $p$ 是质数，且 $B$ 与 $p$ 互质时，有：

$$
B^{-1}\equiv B^{p-2}\pmod p
$$

于是：

$$
\binom{n}{m}\equiv numerator\times denominator^{p-2}\pmod p
$$

其中：

$$
numerator=\prod_{i=1}^{m}(n-m+i)
$$

$$
denominator=\prod_{i=1}^{m}i
$$

### 适用场景

这种写法适合：

- 只计算少量组合数；
- $m$ 比较小；
- 模数是质数；
- 不想提前预处理阶乘数组。

需要注意，如果分母在模意义下没有逆元，这种写法就不能直接使用。最常见的安全场景是：模数 $p$ 是质数，并且 $m<p$。

如果 $m\ge p$，分母中会出现 $p$ 的倍数，分母模 $p$ 等于 $0$，逆元不存在，此时通常需要使用 Lucas 定理或其它方法。

### 一次性计算分子和分母

```python
def comb_direct(n, m, mod):
    """直接计算分子分母，适用于 mod 为质数且分母存在逆元的情况"""
    if m < 0 or m > n:
        return 0

    m = min(m, n - m)

    numerator = 1
    denominator = 1
    for i in range(1, m + 1):
        numerator = numerator * (n - m + i) % mod
        denominator = denominator * i % mod

    return numerator * pow(denominator, mod - 2, mod) % mod

print(comb_direct(6, 2, 1_000_000_007))  # 15
```

### 边乘边除写法

也可以每次乘一个分子，再乘当前 $i$ 的逆元：

$$
ans=ans\times(n-m+i)\times i^{-1}\pmod p
$$

代码如下：

```python
def comb_direct_each_inv(n, m, mod):
    """逐项计算组合数，每一步都乘当前分母的逆元"""
    if m < 0 or m > n:
        return 0

    m = min(m, n - m)
    ans = 1

    for i in range(1, m + 1):
        ans = ans * (n - m + i) % mod
        ans = ans * pow(i, mod - 2, mod) % mod

    return ans

print(comb_direct_each_inv(6, 2, 1_000_000_007))  # 15
```

两种直接写法的区别是：

- 一次性计算分子分母，只求一次逆元，通常更快；
- 边乘边除写法更贴近公式，但会求多次逆元，常数较大。

### 复杂度

设 $m=\min(m,n-m)$。

一次性计算分子分母：

- 时间复杂度：$O(m+\log mod)$
- 空间复杂度：$O(1)$

边乘边除：

- 时间复杂度：$O(m\log mod)$
- 空间复杂度：$O(1)$

---

## 三种写法对比

| 写法 | 是否需要预处理 | 单次复杂度 | 模数要求 | 适合场景 |
|---|---:|---:|---|---|
| 阶乘 + 逆阶乘 | 需要 | $O(1)$ | 通常要求质数模数 | 大量查询 |
| 杨辉三角 DP | 不需要 | $O(nm)$ | 任意模数 | $n$ 不大、模数不一定是质数 |
| 直接分子分母 | 不需要 | $O(m+\log mod)$ | 质数模数，分母需可逆 | 少量查询、$m$ 较小 |

## 易错点

- 当 $m<0$ 或 $m>n$ 时，应该返回 $0$。
- 计算前通常使用 $m=\min(m,n-m)$ 优化循环次数。
- 预处理阶乘写法依赖模数为质数，因为使用了费马小定理求逆元。
- 直接计算分子分母时，不能直接使用 `/`，必须乘逆元。
- 如果模数不是质数，`pow(x, mod - 2, mod)` 不一定能求逆元。
- 如果分母在模意义下为 $0$，逆元不存在，直接分子分母写法不能使用。
- 杨辉三角一维 DP 必须倒序枚举 $j$，否则会重复使用当前轮已经更新过的值。
