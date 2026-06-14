---
tags:
  - yyn
  - 算法模板
  - 动态规划
---

# 背包 DP

背包 DP 研究的是：在容量限制下，从若干物品中选择一部分，使总价值最大、方案数最多，或者判断能否达到某个容量。

最常见的三个模型是：

| 类型 | 每个物品可选次数 | 一维 DP 的容量枚举方向 |
|---|---:|---|
| 0-1 背包 | 至多一次 | 倒序 |
| 完全背包 | 无限次 | 正序 |
| 多重背包 | 有限次 | 拆分后按 0-1 背包处理 |

## 0-1 背包

### 经典例题

!!! example "例题：Charm Bracelet 模型"
    有 \(n\) 个物品和一个容量为 \(W\) 的背包。第 \(i\) 个物品重量为 \(w_i\)，价值为 \(v_i\)。每个物品最多选择一次，求不超过背包容量时能获得的最大价值。

0-1 背包的关键词是“每个物品最多选一次”。因此处理第 \(i\) 个物品时，只有两种选择：选或不选。

### 状态设计

设：

\[
f[i][j] = \text{只考虑前 } i \text{ 个物品，容量不超过 } j \text{ 时的最大价值}
\]

不选第 \(i\) 个物品：

\[
f[i][j]=f[i-1][j]
\]

选第 \(i\) 个物品：

\[
f[i][j]=f[i-1][j-w_i]+v_i \quad (j\ge w_i)
\]

所以：

\[
f[i][j]=\max(f[i-1][j], f[i-1][j-w_i]+v_i)
\]

### 模板代码：二维 DP

```python
n, W = 5, 20
items = [(1, 6), (2, 5), (3, 8), (5, 15), (3, 3)]  # (重量, 价值)

f = [[0] * (W + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    w, v = items[i - 1]
    for j in range(W + 1):
        f[i][j] = f[i - 1][j]
        if j >= w:
            f[i][j] = max(f[i][j], f[i - 1][j - w] + v)

print(f[n][W])
```

### 一维空间优化

由于第 \(i\) 层只依赖第 \(i-1\) 层，可以把二维数组压成一维：

\[
dp[j]=\max(dp[j], dp[j-w_i]+v_i)
\]

但是 0-1 背包必须**倒序枚举容量**。倒序可以保证 \(dp[j-w_i]\) 还是上一轮物品的状态，不会重复使用当前物品。

<div class="yyn-carousel" tabindex="0" aria-label="背包 DP 容量枚举方向手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="0-1 背包倒序枚举：当前物品只能使用一次。"><img src="../../assets/images/dp/knapsack-step-1.svg" alt="0-1 背包倒序枚举容量"></div>
    <div class="yyn-carousel-slide" data-caption="反例提示：0-1 背包正序枚举可能重复使用当前物品。"><img src="../../assets/images/dp/knapsack-step-2.svg" alt="0-1 背包正序枚举的错误示意"></div>
    <div class="yyn-carousel-slide" data-caption="完全背包正序枚举：允许在同一轮继续使用当前物品。"><img src="../../assets/images/dp/knapsack-step-3.svg" alt="完全背包正序枚举容量"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 3</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">0-1 背包倒序枚举：当前物品只能使用一次。</div>
</div>

### 模板代码：一维 DP

```python
n, W = 5, 20
items = [(1, 6), (2, 5), (3, 8), (5, 15), (3, 3)]

dp = [0] * (W + 1)

for w, v in items:
    for j in range(W, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[W])
```

!!! warning "为什么不能正序"
    如果 0-1 背包正序枚举，更新 \(dp[j]\) 时用到的 \(dp[j-w_i]\) 可能已经包含当前物品，等价于同一个物品被选了多次。

## 完全背包

### 经典例题

!!! example "例题：无限物品选择"
    有 \(n\) 种物品，第 \(i\) 种物品重量为 \(w_i\)，价值为 \(v_i\)，每种物品可以选择任意多次。背包容量为 \(W\)，求最大价值。

完全背包与 0-1 背包的区别是：当前物品可以重复使用。因此如果选择第 \(i\) 个物品，后续仍然可以继续选择第 \(i\) 个物品。

### 状态转移

二维状态仍然可以定义为：

\[
f[i][j] = \text{只考虑前 } i \text{ 种物品，容量不超过 } j \text{ 时的最大价值}
\]

不选当前物品：

\[
f[i][j]=f[i-1][j]
\]

选当前物品后，仍然可以继续选当前物品：

\[
f[i][j]=f[i][j-w_i]+v_i
\]

所以：

\[
f[i][j]=\max(f[i-1][j], f[i][j-w_i]+v_i)
\]

### 模板代码：一维 DP

完全背包一维写法中，容量必须**正序枚举**：

```python
n, W = 5, 20
items = [(1, 6), (2, 5), (3, 8), (5, 15), (3, 3)]

dp = [0] * (W + 1)

for w, v in items:
    for j in range(w, W + 1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[W])
```

正序枚举时，\(dp[j-w_i]\) 可能已经被当前物品更新过，这恰好表示当前物品可以重复选择。

## 多重背包

### 经典例题

!!! example "例题：有限数量物品选择"
    有 \(n\) 种物品，第 \(i\) 种物品重量为 \(w_i\)，价值为 \(v_i\)，数量为 \(s_i\)。每种物品最多选择 \(s_i\) 个，背包容量为 \(W\)，求最大价值。

多重背包介于 0-1 背包和完全背包之间。直接枚举每种物品选几个是可行的，但复杂度较高。

### 朴素转移

设：

\[
f[i][j] = \text{只考虑前 } i \text{ 种物品，容量为 } j \text{ 时的最大价值}
\]

枚举第 \(i\) 种物品选 \(k\) 个：

\[
f[i][j] = \max_{0\le k\le s_i,\ kw_i\le j}\{f[i-1][j-kw_i]+kv_i\}
\]

### 模板代码：朴素写法

```python
n, W = 3, 30
items = [(1, 2, 3), (4, 5, 6), (7, 8, 9)]  # (重量, 价值, 数量)

f = [[0] * (W + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    w, v, s = items[i - 1]
    for j in range(W + 1):
        f[i][j] = f[i - 1][j]
        for k in range(1, s + 1):
            if j >= k * w:
                f[i][j] = max(f[i][j], f[i - 1][j - k * w] + k * v)

print(f[n][W])
```

### 二进制分组优化

将数量 \(s_i\) 拆成若干组：

\[
1,2,4,\ldots,rest
\]

每一组看成一个 0-1 物品，就可以转化为 0-1 背包。

```python
n, W = 3, 30
items = [(1, 2, 3), (4, 5, 6), (7, 8, 9)]

goods = []
for w, v, s in items:
    k = 1
    while k <= s:
        goods.append((k * w, k * v))
        s -= k
        k <<= 1
    if s > 0:
        goods.append((s * w, s * v))

dp = [0] * (W + 1)
for w, v in goods:
    for j in range(W, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[W])
```

## 小结

背包 DP 最重要的是区分“当前物品能否重复使用”。0-1 背包倒序，完全背包正序，多重背包可以先拆成若干个 0-1 物品再处理。
