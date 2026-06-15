# Z 函数

Z 函数用于计算字符串每个后缀和原串的最长公共前缀长度。对字符串 `s`，定义：

\[
z[i]=LCP(s, s[i:])
\]

也就是从位置 `i` 开始的后缀，和整个字符串从开头开始，最多能匹配多少个字符。通常令：

\[
z[0]=n
\]

## 例题：查找模式串出现位置

!!! example "例题"
    给定模式串 `p` 和文本串 `s`，找出 `p` 在 `s` 中出现的位置。

可以构造：

```text
p + '#' + s
```

如果某个位置的 Z 值至少为 `len(p)`，说明从该位置开始匹配到了完整模式串。

## 朴素做法为什么慢

对于每个位置 `i`，可以从头开始比较：

```text
s[0], s[1], s[2], ...
s[i], s[i+1], s[i+2], ...
```

这样每个位置都重新比较，最坏会达到 \(O(n^2)\)。

Z 算法的优化点是：如果之前已经知道某一段和开头完全相等，那么落在这段内部的位置，就可以先复用已有结果。

## Z Box 是什么

算法维护一个当前最靠右的匹配段：

```python
[box_l, box_r]
```

它满足：

\[
s[box_l:box_r+1] = s[0:box_r-box_l+1]
\]

也就是说，`box_l` 开始的一段，和字符串开头的一段完全相等。

当当前位置 `i` 落在这个盒子里，即 `i <= box_r`，那么 `i` 对应的位置，在开头那份拷贝中对应 `i - box_l`。因此可以先复用：

\[
z[i] = \min(z[i-box_l], box_r-i+1)
\]

为什么要取 `min`？

- `z[i-box_l]` 是开头对应位置已经算出来的匹配长度；
- `box_r-i+1` 是当前盒子里还能保证相等的最大长度；
- 超出盒子的部分没有保证，需要后面继续暴力扩展。

## 图示：Z Box 复用

<div class="yyn-carousel" tabindex="0" aria-label="Z 函数过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：z[i] 表示 s 和 s[i:] 的最长公共前缀。"><img src="../../assets/images/string/z-step-1.svg" alt="Z 函数第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：维护当前最右匹配段 [box_l, box_r]。"><img src="../../assets/images/string/z-step-2.svg" alt="Z 函数第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：i 在盒子中时，可以先复用已有 Z 值。"><img src="../../assets/images/string/z-step-3.svg" alt="Z 函数第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：复用后继续向右扩展，并更新最右匹配段。"><img src="../../assets/images/string/z-step-4.svg" alt="Z 函数第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：z[i] 表示 s 和 s[i:] 的最长公共前缀。</div>
</div>

## 模板代码逐步解释

代码从 `i=1` 开始，因为 `z[0]` 最后直接设为 `n`。

```python
if i <= box_r:
    z[i] = min(z[i - box_l], box_r - i + 1)
```

这一段表示当前位置 `i` 在已经匹配过的盒子中，可以先得到一个保底匹配长度。

然后：

```python
while i + z[i] < n and s[z[i]] == s[i + z[i]]:
    box_l, box_r = i, i + z[i]
    z[i] += 1
```

这表示从当前已知的 `z[i]` 继续向右扩展。每多匹配一个字符，就说明从 `i` 开始的匹配段可以更长，同时最右匹配段可能被更新。

最后：

```python
z[0] = n
```

表示整个字符串和自己匹配，长度是 `n`。

## 代码模板

```python
def cal_z(s):
    """计算Z函数，最长公共前后缀"""
    # z[i]表示 s 与 s[i:] 的最长公共前缀长度
    n = len(s)
    z = [0] * n
    box_l = box_r = 0
    for i in range(1, n):
        if i <= box_r:
            z[i] = min(z[i - box_l], box_r - i + 1)
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            box_l, box_r = i, i + z[i]
            z[i] += 1
    z[0] = n
    return z

# 示例使用
s = 'babab'
z = cal_z(s)
print("Z函数结果:", z)  # [5, 0, 3, 0, 1]
```

## 用 Z 函数做模式匹配

构造 `p + '#' + s`。分隔符 `#` 的作用是防止匹配跨过模式串和主串的边界。对新串求 Z 函数后，如果某个位置 `i` 满足：

\[
z[i]\ge |p|
\]

说明从 `i` 开始的后缀和开头的模式串至少匹配了 `|p|` 个字符，也就是找到一次模式串出现。

## 复杂度

虽然代码里有 `while` 扩展，但每次扩展都会推动右端点向右走，整体不会反复退回，所以总复杂度为 \(O(n)\)。

## 易错点

- `z[i]` 比较的是 `s` 和 `s[i:]`，不是两个任意后缀。
- `box_r - i + 1` 是盒子里还能保证相等的长度。
- 用于匹配时，分隔符必须选择不会出现在原字符串中的字符。
