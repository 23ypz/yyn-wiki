---
tags:
  - yyn
  - 算法模板
---

# 数论基础
**算法介绍：**
数论基础是算法竞赛中的重要组成部分，涉及整数的性质、运算和相关算法。包括最大公约数、质数判断、组合数学等内容。

**应用场景：**
- 数学问题求解
- 密码学基础
- 数值计算
- 组合计数

### 普通快速幂

```python
def ksm(a, b, p):
    """快速幂计算 a^b % p"""
    res = 1
    while b:
        if b & 1:
            res = (res * a) % p
        a = (a * a) % p
        b >>= 1
    return res

# 示例使用
print(ksm(2, 10, 1000000007))  # 2^10 % 1000000007
```

### 最大公约数gcd

```python
def gcd(a, b):
    """欧几里得算法求最大公约数"""
    while b:
        a, b = b, a % b
    return a

# 示例使用
a, b = 2, 8
print("gcd:", gcd(a, b))  # 输出2
```

### 最小公倍数

```python
def gcd(a, b):
    """欧几里得算法求最大公约数"""
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    """最小公倍数"""
    return (a // gcd(a, b)) * b

# 示例使用
a, b = 2, 8
print("gcd:", gcd(a, b))  # 输出2
print("lcm:", lcm(a, b))  # 输出8
```

### 矩阵快速幂

```python
mod = 10 ** 9 + 7

def mul(a, b):
    """矩阵乘法"""
    n1, m1 = len(a), len(a[0])
    n2, m2 = len(b), len(b[0])
    c = [[0] * m2 for i in range(n1)]
    for i in range(n1):
        for j in range(m2):
            for k in range(m1):
                c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % mod
    return c

def ksm(a, b, ns):
    """矩阵快速幂"""
    res = [[1 if i == j else 0 for i in range(ns)] for j in range(ns)]  # 单位矩阵
    while b:
        if b & 1:
            res = mul(res, a)
        a = mul(a, a)
        b >>= 1
    return res

# 示例：计算斐波那契数列第n项
n = 1000000000
mat = [[1, 1], [1, 0]]
res = ksm(mat, n - 2, 2)
print("斐波那契数列第n项:", (res[0][0] + res[0][1]) % mod)
```

### 组合数计算

```python
mod = 1_000_000_007
mx = 100_001

# 预处理阶乘
fac = [0] * mx  # fac[i] = i!
fac[0] = 1
for i in range(1, mx):
    fac[i] = fac[i - 1] * i % mod

# 预处理逆阶乘
inv_f = [0] * mx
inv_f[-1] = pow(fac[-1], mod - 2, mod)  # 费马小定理求逆元
for i in range(mx - 1, 0, -1):
    inv_f[i - 1] = inv_f[i] * i % mod

def comb(n, m):
    """从 n 个数中选 m 个数的方案数"""
    return fac[n] * inv_f[m] * inv_f[n - m] % mod if 0 <= m <= n else 0

print("C(6,2):", comb(6, 2))  # 输出15
```

### 质因数分解

```python
# 法一：试除法，时间复杂度O(√n)
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

# 法二：预处理每个数的不同质因子，原理同埃氏筛
mx = 10 ** 5 + 1
prime_facs = [[] for i in range(mx)]
for i in range(2, mx):
    if not prime_facs[i]:  # i 是质数
        for j in range(i, mx, i):  # i 的倍数 j 有质因子 i
            prime_facs[j].append(i)

# 法三：预处理最小质数因子LPF(x)，做到O(logx)分解
lpf = [0] * mx
for i in range(2, mx):
    if lpf[i] == 0:  # i 是质数
        for j in range(i, mx, i):
            if lpf[j] == 0:  # 首次访问 j
                lpf[j] = i

def get_fac2(x):
    """O(logx)时间分解质因数"""
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

# 示例使用
n = 10
print("方法一:", get_fac(n))
print("方法三:", get_fac2(n))
```

### 质数筛

```python
mx = 10 ** 6 + 1
isp = [True] * mx  # isp[i]表示i是否为质数
primes = []

for i in range(2, mx):
    if isp[i]:
        primes.append(i)
        for j in range(i * i, mx, i):  # 埃氏筛
            isp[j] = False

isp[0] = isp[1] = False

print("质数列表:", primes[:10])  # 前10个质数
```

### 费马小定理求逆元

```python
# p 是一个大质数
# a/b % p结果如下
p = 10 ** 9 + 7
a = 1
b = 2

# 使用费马小定理：a/b % p = a * b^(p-2) % p
ans = (a * pow(b, p - 2, p)) % p
print("1/2 mod 1e9+7 =", ans)  # 输出500000004
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

