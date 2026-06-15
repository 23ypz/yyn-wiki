# 二维差分

二维差分用于处理大量子矩形加值操作。它是一维差分在二维矩阵上的推广，也是二维前缀和的逆操作。

## 例题：多次子矩形加

!!! example "例题"
    给定一个 \(n\times m\) 的矩阵，有 \(q\) 次操作，每次给左上角 \((r_1,c_1)\) 到右下角 \((r_2,c_2)\) 的子矩形全部加上 \(v\)。最后输出修改后的矩阵。

## 原理

如果要给矩形 \((r_1,c_1)\) 到 \((r_2,c_2)\) 全部加上 \(v\)，二维差分在四个角打标记：

\[
d[r_1][c_1]\mathrel{+}=v
\]

\[
d[r_1][c_2+1]\mathrel{-}=v
\]

\[
d[r_2+1][c_1]\mathrel{-}=v
\]

\[
d[r_2+1][c_2+1]\mathrel{+}=v
\]

这四个操作的含义是：左上角加值让影响开始，右侧和下方的两个减号截断多余影响，右下角加号补回被重复抵消的区域。

最后对差分矩阵做二维前缀和即可恢复变化量：

\[
d[i][j]\leftarrow d[i][j]+d[i-1][j]+d[i][j-1]-d[i-1][j-1]
\]

## 图示：四角标记

<div class="yyn-carousel" tabindex="0" aria-label="二维差分过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：目标是给一个子矩形整体加 v。"><img src="../../assets/images/prefix-difference/difference-2d-step-1.svg" alt="二维差分第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：在左上角加 v，让影响从这里开始。"><img src="../../assets/images/prefix-difference/difference-2d-step-2.svg" alt="二维差分第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：在右侧和下方减 v，截断多余影响。"><img src="../../assets/images/prefix-difference/difference-2d-step-3.svg" alt="二维差分第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：右下角再加 v，修正重复抵消。"><img src="../../assets/images/prefix-difference/difference-2d-step-4.svg" alt="二维差分第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：目标是给一个子矩形整体加 v。</div>
</div>

## 代码模板

```python
a = [[1, 1, 1],
     [1, 1, 1],
     [1, 1, 1]]

options = [(1, 1, 1, 2, 7),      # 在矩形(1,1)到(1,2)加上7
           (2, 2, 3, 3, 5)]      # 在矩形(2,2)到(3,3)加上5

n, m = len(a), len(a[0])
dif = [[0] * (m + 2) for i in range(n + 2)]

# 构建二维差分数组
for r1, c1, r2, c2, val in options:
    # (r1,c1,r2,c2) >= 1
    dif[r1][c1] += val
    dif[r1][c2 + 1] -= val
    dif[r2 + 1][c1] -= val
    dif[r2 + 1][c2 + 1] += val

# 求前缀和恢复差分数组
for i in range(n + 1):
    for j in range(m + 1):
        dif[i + 1][j + 1] += dif[i + 1][j] + dif[i][j + 1] - dif[i][j]

# 同理一维。a[i][j]对应变化量为dif[i + 1][j + 1]
for i in range(1, n + 1):
    for j in range(1, m + 1):
        a[i - 1][j - 1] += dif[i][j]

print("修改后的矩阵:")
for row in a:
    print(row)
```

## 复杂度

- 每次矩形修改：\(O(1)\)
- 最后恢复矩阵：\(O(nm)\)
- 总复杂度：\(O(nm+q)\)

## 易错点

- 二维差分的四个角符号是 `+ - - +`。
- `dif` 要多开一行一列，因为会访问 `r2 + 1` 和 `c2 + 1`。
- 最后恢复时用的是二维前缀和公式，不能只按行或只按列累加。
