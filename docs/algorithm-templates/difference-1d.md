# 一维差分

一维差分用于处理大量区间修改。它不直接修改区间中的每一个位置，而是在区间左右边界打标记，最后通过前缀和恢复每个位置的真实变化量。

## 例题：多次区间加

!!! example "例题"
    给定长度为 \(n\) 的数组，有 \(q\) 次操作，每次给区间 \([l,r]\) 内的所有元素加上 \(v\)。最后输出修改后的数组。

## 原理

差分数组定义为：

\[
d[1]=a[1]
\]

\[
d[i]=a[i]-a[i-1]\quad (i\ge 2)
\]

反过来，原数组可以由差分数组前缀和恢复：

\[
a[i]=d[1]+d[2]+\cdots+d[i]
\]

如果要给区间 \([l,r]\) 全部加 \(v\)，只需要：

\[
d[l]\mathrel{+}=v
\]

\[
d[r+1]\mathrel{-}=v
\]

从 \(l\) 开始，前缀和都会多出 \(v\)；从 \(r+1\) 开始，再减去 \(v\)，让影响停止。

## 图示：边界打标记

<div class="yyn-carousel" tabindex="0" aria-label="一维差分过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：差分数组的前缀和可以恢复原数组。"><img src="../../assets/images/prefix-difference/difference-1d-step-1.svg" alt="一维差分第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：区间 [2,4] 加 3，先在 d[2] 加 3。"><img src="../../assets/images/prefix-difference/difference-1d-step-2.svg" alt="一维差分第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：在 d[5] 减 3，让影响在 4 之后停止。"><img src="../../assets/images/prefix-difference/difference-1d-step-3.svg" alt="一维差分第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：最后求前缀和恢复，只有 [2,4] 得到 +3。"><img src="../../assets/images/prefix-difference/difference-1d-step-4.svg" alt="一维差分第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：差分数组的前缀和可以恢复原数组。</div>
</div>

## 代码模板

```python
a = [1, 1, 1, 1, 1, 1, 1]

options = [(1, 4, 7), (4, 6, 5)]  # (l,r,val)表示在区间[l,r]加上val

n = len(a)
dif = [0] * (n + 2)  # 多开两个位置防止越界
for l, r, c in options:
    # (l,r) >= 1
    dif[l] += c
    dif[r + 1] -= c

# 恢复差分数组
for i in range(1, n + 2):
    dif[i] += dif[i - 1]

# a[i]对应的变化量是dif[i + 1]
for i in range(1, n + 1):
    a[i - 1] += dif[i]

print("修改后的数组:", a)
```

## 复杂度

- 每次区间修改：\(O(1)\)
- 最后恢复数组：\(O(n)\)
- 总复杂度：\(O(n+q)\)

## 易错点

- 差分适合离线处理：所有修改做完后再统一恢复。
- `dif` 要多开空间，因为会访问 `r + 1`。
- 模板中操作下标是 1-indexed，原数组 `a` 是 0-indexed，所以最后写回时要注意偏移。
