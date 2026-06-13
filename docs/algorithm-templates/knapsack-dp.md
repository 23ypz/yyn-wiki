---
tags:
  - yyn
  - 算法模板
  - 动态规划
---

# 背包 DP

背包问题研究的是：在容量限制下，从若干物品中选择一部分，使总价值最大或方案数满足某些要求。

最常见的三个模型是：

| 类型 | 每个物品可选次数 | 容量枚举方向 |
|---|---:|---|
| 0-1 背包 | 至多一次 | 倒序 |
| 完全背包 | 无限次 | 正序 |
| 多重背包 | 有限次 | 可拆分或单调队列优化 |

## 0-1 背包

有 \(n\) 个物品，第 \(i\) 个物品重量为 \(w_i\)，价值为 \(v_i\)，背包容量为 \(W\)。每个物品最多选择一次，求最大价值。

### 二维状态

设：

\[
f[i][j] = \text{只考虑前 } i \text{ 个物品，容量不超过 } j \text{ 时的最大价值}
\]

对于第 \(i\) 个物品，有两种选择。

不选：

\[
f[i][j]=f[i-1][j]
\]

选：

\[
f[i][j]=f[i-1][j-w_i]+v_i \quad (j\ge w_i)
\]

所以：

\[
f[i][j]=\max(f[i-1][j], f[i-1][j-w_i]+v_i)
\]

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

由于第 \(i\) 层只依赖第 \(i-1\) 层，可以压成一维：

\[
f[j]=\max(f[j], f[j-w_i]+v_i)
\]

但是 0-1 背包必须**倒序枚举容量**。因为同一个物品最多选一次，倒序可以保证 \(f[j-w_i]\) 仍然是上一轮物品的状态，不会重复使用当前物品。

下面的手动轮播图展示 0-1 背包和完全背包在一维数组中为什么枚举方向不同。

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

```python
dp = [0] * (W + 1)

for w, v in items:
    for j in range(W, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[W])
```

!!! warning "为什么不能正序"
    如果 0-1 背包正序枚举，更新 \(dp[j]\) 时用到的 \(dp[j-w]\) 可能已经包含当前物品，等价于同一个物品被选了多次。

## 完全背包

完全背包与 0-1 背包的区别是：每个物品可以选择无限次。

二维转移可以写成：

\[
f[i][j]=\max(f[i-1][j], f[i][j-w_i]+v_i)
\]

注意右侧第二项是 \(f[i][j-w_i]\)，表示选择当前物品后，还可以继续选择当前物品。

一维写法中，需要**正序枚举容量**：

```python
n, W = 5, 20
items = [(1, 6), (2, 5), (3, 8), (5, 15), (3, 3)]

dp = [0] * (W + 1)

for w, v in items:
    for j in range(w, W + 1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[W])
```

## 多重背包

多重背包中，第 \(i\) 个物品最多可以选 \(s_i\) 次。

最直接的转移是枚举选几个：

\[
f[i][j] = \max_{0\le k\le s_i,\ kw_i\le j} \{f[i-1][j-kw_i]+kv_i\}
\]

朴素写法：

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

把 \(s\) 个相同物品拆成若干组：

\[
1,2,4,\dots,2^t,\text{剩余数量}
\]

每组看作一个新的 0-1 物品。这样每种物品由 \(s\) 次枚举优化为 \(O(\log s)\) 组。

```python
n, W = 3, 30
items = [(1, 2, 3), (4, 5, 6), (7, 8, 9)]

groups = []
for w, v, s in items:
    k = 1
    while k <= s:
        groups.append((k * w, k * v))
        s -= k
        k <<= 1
    if s:
        groups.append((s * w, s * v))

# 对拆出的每一组做 0-1 背包
dp = [0] * (W + 1)
for w, v in groups:
    for j in range(W, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[W])
```

## 三种背包对比

| 模型 | 转移来源 | 一维枚举方向 | 关键原因 |
|---|---|---|---|
| 0-1 背包 | 上一层 \(i-1\) | 倒序 | 防止重复选当前物品 |
| 完全背包 | 当前层 \(i\) | 正序 | 允许重复选当前物品 |
| 多重背包 | 上一层 + 数量限制 | 常用二进制拆分 | 把有限个物品转成多个 0-1 物品 |

!!! tip "做题时如何判断背包类型"
    - “每个物品只能选一次”：0-1 背包。
    - “每种物品可以无限选”：完全背包。
    - “每种物品有固定数量”：多重背包。
    - “问方案数”：转移一般从 `max` 改为加法，并注意排列/组合的枚举顺序。
