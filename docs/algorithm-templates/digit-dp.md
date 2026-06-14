---
tags:
  - yyn
  - 算法模板
  - 动态规划
---

# 数位 DP

数位 DP 用于统计一个整数区间内满足某种性质的数字数量。典型做法是把数字按十进制位拆开，从高位到低位递归枚举，同时记录“当前是否贴着上界”“是否已经开始填数字”等状态。

常见问题包括：

- 统计 \([L,R]\) 中不含某个数字的数；
- 统计数字和满足条件的数；
- 统计相邻数位不相同的数；
- 统计二进制中 1 的个数满足条件的数。

## 基本套路

如果要统计 \([L,R]\)，通常先设计前缀函数：

\[
ans(L,R)=F(R)-F(L-1)
\]

其中 \(F(x)\) 表示 \([0,x]\) 中满足条件的数字数量。这样问题就转化为：如何统计不超过上界 \(x\) 的合法数。

## 经典例题：数字和取模

!!! example "例题：统计数字和能被 m 整除的数"
    给定 \(L,R,m\)，统计区间 \([L,R]\) 中有多少个正整数的各位数字之和能被 \(m\) 整除。

    例如，当 \(m=3\) 时，数字 `12` 的数字和为 `1+2=3`，可以被 `3` 整除，因此它是合法数字。

这个问题适合用数位 DP，因为我们需要在一个范围内统计数字，并且限制条件只和“已经填过的数位和模 \(m\) 的值”有关。

## 状态设计

设上界数字为数组 \(s\)，从高位到低位处理。定义递归状态：

\[
dfs(i, is\_num, is\_limit, rem)
\]

各参数含义如下：

| 参数 | 含义 |
|---|---|
| `i` | 当前处理到第几位 |
| `is_num` | 前面是否已经填过非前导零数字 |
| `is_limit` | 当前前缀是否仍然贴着上界 |
| `rem` | 当前已填数字和对 \(m\) 取模后的结果 |

如果 `is_limit=True`，当前位最多只能填上界对应位；否则可以填到 `9`。

\[
up = \begin{cases}
s[i], & is\_limit=True \\
9, & is\_limit=False
\end{cases}
\]

如果当前位填入 \(d\)，那么下一层的余数为：

\[
rem'=(rem+d)\bmod m
\]

<figure class="algo-figure" markdown>
![数位 DP 状态树示意图](../assets/images/dp/digit-dp-tree.svg)
<figcaption>图 1：如果当前位填了比上界小的数字，后续位就不再受上界限制。</figcaption>
</figure>

## 模板代码

下面代码保留了 `is_num`，用于处理前导零。最终只统计正整数；如果题目要把 `0` 也算入答案，需要单独处理边界。

```python
from functools import lru_cache

MOD = 3

def count_leq(x: int) -> int:
    """统计 [1, x] 中数字和能被 MOD 整除的数的个数。"""
    if x <= 0:
        return 0

    s = list(map(int, str(x)))
    n = len(s)

    @lru_cache(None)
    def dfs(i: int, is_num: bool, is_limit: bool, rem: int) -> int:
        """
        i: 当前处理的位置
        is_num: 前面是否已经开始填数字
        is_limit: 是否受到上界限制
        rem: 当前数字和模 MOD 的结果
        """
        if i == n:
            return int(is_num and rem == 0)

        res = 0

        # 继续跳过当前位置，保持前导零状态
        if not is_num:
            res += dfs(i + 1, False, False, rem)

        up = s[i] if is_limit else 9
        low = 0 if is_num else 1

        for d in range(low, up + 1):
            new_rem = (rem + d) % MOD
            res += dfs(i + 1, True, is_limit and d == up, new_rem)

        return res

    return dfs(0, False, True, 0)

def solve(L: int, R: int) -> int:
    return count_leq(R) - count_leq(L - 1)

print(solve(1, 100))
```

## 通用模板

如果题目条件不同，只需要把 `state` 的含义和更新方式改掉。

```python
from functools import lru_cache

def f(h):
    """统计小于等于 h 的满足条件的数字个数。"""
    if h < 0:
        return 0

    s = list(map(int, str(h)))
    n = len(s)

    @lru_cache(None)
    def dfs(i, is_num, is_limit, state):
        if i == n:
            # 根据题意判断 state 是否合法
            return int(is_num and state == 0)

        res = 0

        if not is_num:
            res += dfs(i + 1, False, False, state)

        up = s[i] if is_limit else 9
        low = 0 if is_num else 1

        for d in range(low, up + 1):
            new_state = state  # 根据题意修改
            res += dfs(i + 1, True, is_limit and d == up, new_state)

        return res

    return dfs(0, False, True, 0)

def main(l, r):
    print(f(r) - f(l - 1))
```

## 状态参数怎么改

数位 DP 的难点通常不在代码框架，而在 `state` 的设计。常见状态包括：

- 数字和：`sum` 或 `sum % mod`；
- 上一位数字：`last`，用于判断相邻位是否合法；
- 是否出现过某个数字：`has_digit`；
- 余数：`rem`，用于统计数字本身能否被某个数整除；
- 数位计数：例如某个数字出现次数。

例如，如果要统计相邻数位不相等的数，可以把 `state` 改为上一位数字 `last`。转移时只允许选择 `d != last` 的数字。

## 易错点

!!! warning "数位 DP 常见错误"
    - `is_limit` 更新条件写错。只有当前位填到上界对应数字时，下一位才继续受限。
    - 前导零处理不清楚，导致把空数字或数字 `0` 误算进答案。
    - 记忆化缓存包含了不该缓存的状态。通常 `is_limit=True` 时状态和具体上界有关，不能随便复用；使用 `lru_cache` 时把 `is_limit` 放入参数即可。
    - 区间统计时忘记用 \(F(R)-F(L-1)\)。
