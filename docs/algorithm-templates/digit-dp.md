# 数位 DP

数位 DP 用来统计区间内满足某些条件的整数个数。它的核心思想是：**把一个数按十进制位拆开，从高位到低位逐位决定填什么数字**。

常见问题包括：

- 统计 $[L,R]$ 中不含某个数字的数有多少个；
- 统计数字和满足条件的数；
- 统计相邻数位满足某种关系的数；
- 统计某个数位出现次数。

## 为什么写成 f(R) - f(L-1)

数位 DP 通常先写：

$$
F(x)=\text{小于等于 } x \text{ 的合法数字个数}
$$

那么区间 $[L,R]$ 的答案是：

$$
F(R)-F(L-1)
$$

这样可以只处理一个上界，代码比同时维护上下界更简单。

## 模板参数解释

常用模板使用：

```python
dfs(i, is_num, is_limit, tar)
```

含义如下：

- `i`：当前处理到第几位。
- `is_num`：前面是否已经填过非前导零数字。
- `is_limit`：当前是否受到上界限制。
- `tar`：题目需要维护的状态，需要按具体题意修改。

如果 `is_limit=True`，当前位最多只能填上界对应位：

```python
up = s[i] if is_limit else 9
```

如果还没有开始填数字，可以继续跳过当前位，也就是继续处理前导零。

## 代码模板

下面给出上下界数位 DP 模板。模板中的 `tar` 是占位状态，需要根据题目修改成数字和、余数、上一位数字等信息。

```python
from functools import lru_cache

def f(h):
    """统计小于等于h的满足条件的数字个数"""
    s = list(map(int, str(h)))
    n = len(s)

    @lru_cache(None)
    def dfs(i, is_num, is_limit, tar):
        """
        :param i: 当前处理的位置
        :param is_num: 是否已经开始填数字（处理前导零）
        :param is_limit: 是否受到上界限制
        :param tar: 根据题意修改的条件参数
        """
        if i == n:
            return is_num and tar  # 如果前导零对题目没有影响 则可以不用 is_num 参数
        
        up = s[i] if is_limit else 9
        
        if not is_num:
            # 还处于前导 0 状态  继续填 0
            res = dfs(i + 1, is_num, False, tar)
        else:
            res = dfs(i + 1, is_num, is_limit and up == 0, tar)

        for d in range(1, up + 1):
            res += dfs(i + 1, is_num, is_limit and d == up, tar)
        return res

    return dfs(0, False, True, 0)

def main(l, r):
    """统计区间[l,r]内满足条件的数字个数"""
    print(f(r) - f(l - 1))

# 示例使用
main(1, 100)
```

## 使用模板时怎么改

以“统计数字和能被 $m$ 整除”为例，可以把 `tar` 改成当前数字和对 $m$ 的余数 `rem`。

每次填入数字 `d`，状态更新为：

$$
rem' = (rem + d) \bmod m
$$

递归结束时，如果已经形成数字，并且余数为 0，则说明这个数合法。

## 易错点

- `is_num` 用来处理前导零，如果题目要统计数字 0，需要单独考虑边界。
- `is_limit and d == up` 表示只有当前位也贴着上界填，下一位才继续受限制。
- `lru_cache` 适合状态数量不太大的情况；如果 `tar` 维度太大，需要重新设计状态。
- 区间统计通常写成 `f(r) - f(l - 1)`，初学时不建议直接在一个 DFS 中同时处理两个边界，容易增加状态复杂度。
