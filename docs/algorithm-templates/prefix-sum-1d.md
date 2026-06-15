# 一维前缀和

一维前缀和用于快速查询数组中任意区间的元素和。它的核心思想是：先把从开头到每个位置的和都预处理出来，之后查询区间时只需要做一次减法。

## 例题：多次区间和查询

!!! example "例题"
    给定长度为 \(n\) 的数组 \(a\)，有 \(q\) 次询问，每次给出 \(l,r\)，求区间 \([l,r]\) 的元素和。

    如果每次都从 \(l\) 加到 \(r\)，一次查询最坏是 \(O(n)\)。当 \(q\) 很大时，这种写法会超时。

## 原理

定义前缀和数组：

\[
p[i]=a[1]+a[2]+\cdots+a[i]
\]

同时令：

\[
p[0]=0
\]

这样区间 \([l,r]\) 的和可以写成：

\[
\sum_{i=l}^{r}a[i]=p[r]-p[l-1]
\]

为什么可以这样做？因为 \(p[r]\) 包含前 \(r\) 个数，\(p[l-1]\) 包含区间左侧所有数。两者相减后，左侧多余部分被抵消，只剩下目标区间。

## 图示：查询区间和

<div class="yyn-carousel" tabindex="0" aria-label="一维前缀和过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：先补 p[0]=0，让所有区间查询公式统一。"><img src="../../assets/images/prefix-difference/prefix-1d-step-1.svg" alt="一维前缀和第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：依次计算 p[i]=p[i-1]+a[i]。"><img src="../../assets/images/prefix-difference/prefix-1d-step-2.svg" alt="一维前缀和第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：查询 [2,4] 时使用 p[4]-p[1]。"><img src="../../assets/images/prefix-difference/prefix-1d-step-3.svg" alt="一维前缀和第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：相减后左侧贡献抵消，只留下目标区间。"><img src="../../assets/images/prefix-difference/prefix-1d-step-4.svg" alt="一维前缀和第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：先补 p[0]=0，让所有区间查询公式统一。</div>
</div>

## 代码模板

```python
a = [1, 1, 1, 1, 1, 1, 1]

# 构建前缀和数组，p[0] = 0
p = [0]
for x in a:
    p.append(p[-1] + x)


def pre(i):
    '''
    :param i: 前i个数(i >= 1)
    :return: 返回前i个数之和(i >= 1)
    '''
    return p[i]


def query(l, r):
    '''
    :param l: 查询左端点(l >= 1)
    :param r: 查询右端点(r >= 1)
    :return: 返回区间[l,r]的和
    '''
    return pre(r) - pre(l - 1)


print(query(1, 3))  # 输出区间[1,3]的和
```

## 复杂度

- 预处理：\(O(n)\)
- 单次查询：\(O(1)\)
- 空间复杂度：\(O(n)\)

## 易错点

- 推荐使用 \(p[0]=0\)，这样查询 \([1,r]\) 时也是 `p[r] - p[0]`。
- 模板中 `query(l, r)` 默认 \(l,r\) 是 1-indexed。
- 前缀和适合静态数组；如果数组频繁修改，需要考虑树状数组或线段树。
