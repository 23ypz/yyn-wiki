---
tags:
  - yyn
  - 算法模板
  - 线性基
  - 位运算
---

# 线性基

线性基用于维护一组数在异或意义下能表示出的所有结果。它可以解决“从若干数中选一些数，使它们的异或和最大”等问题。

!!! example "例题：子序列最大异或和"
    给定若干整数，可以从中任意选择一些数，求能得到的最大异或和。

异或可以看成二进制向量在模 2 意义下的加法。线性基维护的就是这些二进制向量的一组基。

## 核心思想

设 `b[i]` 表示最高位为 `i` 的一个基。线性基维护下面的不变量：

- 每个非零的 `b[i]` 最高位都是 `i`；
- 不同基的最高位互不相同；
- 已插入的所有数能异或出的集合，与这些基能异或出的集合相同。

插入一个数 `x` 时，从高位到低位检查。如果 `x` 的最高位是 `i`：

- 如果 `b[i]` 为空，那么 `x` 提供了新的独立信息，令 `b[i]=x`；
- 如果 `b[i]` 已存在，就令 `x ^= b[i]`，相当于消掉 `x` 的最高位。

如果最后 `x` 变成 0，说明它可以被已有基异或表示，不需要加入。

## 图示：插入和求最大异或

<div class="yyn-carousel" tabindex="0" aria-label="线性基过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：插入 5，二进制 101，最高位为 2，放入 b[2]。"><img src="../../assets/images/basic/xor-basis-step-1.svg" alt="线性基第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：插入 3，二进制 011，最高位为 1，放入 b[1]。"><img src="../../assets/images/basic/xor-basis-step-2.svg" alt="线性基第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：插入 6 时会被已有基消成 0，说明 6 可以由 5 xor 3 表示。"><img src="../../assets/images/basic/xor-basis-step-3.svg" alt="线性基第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：求最大异或时从高位到低位贪心，能让 res 变大就异或该基。"><img src="../../assets/images/basic/xor-basis-step-4.svg" alt="线性基第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 4</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：插入 5，二进制 101，最高位为 2，放入 b[2]。</div>
</div>

## 代码模板

下面保留你原来的完整模板风格。

```python
class XorBasis:
    """线性基，用于求解子序列最大 XOR 值"""

    # n 为值域最大值 U 的二进制长度，例如 U=1e9 时 n=30
    def __init__(self, n: int):
        self.b = [0] * n

    def insert(self, x: int) -> None:
        """插入数字到线性基中"""
        b = self.b
        # 从高到低遍历，保证计算 max_xor 的时候，
        # 参与 XOR 的基的最高位（或者说二进制长度）是互不相同的
        for i in range(len(b) - 1, -1, -1):
            if x >> i:
                # 由于大于 i 的位都被我们异或成了 0，
                # 所以 x >> i 的结果只能是 0 或 1
                if b[i] == 0:
                    # x 和之前的基是线性无关的
                    b[i] = x
                    return
                x ^= b[i]
        # 正常循环结束，此时 x=0，说明一开始的 x
        # 可以被已有基表出，不是一个线性无关基

    def max_xor(self) -> int:
        """求能得到的最大 XOR 值"""
        b = self.b
        res = 0
        # 从高到低贪心：越高的位，越必须是 1
        # 由于每个位的基至多一个，所以每个位只需考虑异或一个基，若能变大，则异或之
        for i in range(len(b) - 1, -1, -1):
            if res ^ b[i] > res:  # 手写 max 更快
                res ^= b[i]
        return res


# 示例使用
xor_basis = XorBasis(30)  # 假设数值范围在 2^30 内
nums = [1, 2, 3, 4, 5]
for num in nums:
    xor_basis.insert(num)

print("最大 XOR 值:", xor_basis.max_xor())
```

## 为什么求最大值时可以贪心

异或值的大小首先由最高位决定。如果当前有机会让更高位变成 1，那么无论低位如何变化，都应该优先让高位为 1。

所以从高位到低位枚举 `b[i]`：

$$
res' = res \oplus b[i]
$$

如果：

$$
res' > res
$$

说明异或这个基能让当前结果变大，就执行：

```python
res ^= b[i]
```

由于线性基已经保证每个最高位最多一个基，这个贪心过程不会相互冲突。

## 复杂度

设值域二进制长度为 `L`。

- 插入一个数：$O(L)$
- 查询最大异或值：$O(L)$
- 空间复杂度：$O(L)$

如果整数范围小于 $2^{30}$，通常令 `L=30` 或 `31`。如果可能到 $10^{18}$，则需要令 `L=60` 左右。

## 易错点

- `XorBasis(30)` 只适合值域不超过约 $2^{30}$ 的情况，范围更大时要增大长度。
- `max_xor()` 求的是任选若干已插入数字能得到的最大异或和。
- 插入时必须从高位到低位处理，否则无法保证基的最高位互不相同。
- 线性基和 01 Trie 都能处理异或问题，但线性基处理的是“任选子集异或”，01 Trie 通常处理“两数异或最大”。
