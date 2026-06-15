# 字符串哈希

字符串哈希把字符串看成一个进制数，并对模数取模。它可以在 \(O(1)\) 时间内比较两个子串是否相等，也常用于快速判断回文。

## 例题：判断子串是否回文

!!! example "例题"
    给定字符串 `s`，多次询问子串 `s[l:r]` 是否是回文串。

可以预处理正向哈希和反向哈希。如果一个子串的正向哈希等于它在反串中的对应哈希，则它大概率是回文。

## 为什么可以把字符串看成数字

假设进制为 \(P\)，字符被映射成数字。字符串 `abc` 可以看成类似：

\[
a\cdot P^2+b\cdot P+c
\]

如果从左到右维护前缀哈希，那么加入一个新字符时，旧哈希整体左移一位，也就是乘上 \(P\)，再加上当前字符值：

\[
h[i]=h[i-1]\cdot P+val(s_i)
\]

模板中为了避免数字过大，对 `mod` 取模：

\[
h[i]=(h[i-1]\cdot P+val(s_i))\bmod mod
\]

## 子串哈希公式怎么来的

设要取子串 \([l,r]\)，前缀哈希 `h[r]` 表示 `s[1..r]` 对应的哈希。

其中包含了左边多余的前缀 `s[1..l-1]`。但这个前缀在 `h[r]` 中被向左移动了 \(r-l+1\) 位，所以要减掉：

\[
h[l-1]\cdot P^{r-l+1}
\]

因此：

\[
hash(l,r)=h[r]-h[l-1]\cdot P^{r-l+1}
\]

模板里使用数组 `p` 预处理 \(P^k\)，所以可以 \(O(1)\) 求任意子串哈希。

## 图示：前缀哈希截取子串

<div class="yyn-carousel" tabindex="0" aria-label="字符串哈希过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：把字符串看成 P 进制数字。"><img src="../../assets/images/string/hash-step-1.svg" alt="字符串哈希第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：预处理前缀哈希和 P 的幂。"><img src="../../assets/images/string/hash-step-2.svg" alt="字符串哈希第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：用右前缀减去左侧多余前缀。"><img src="../../assets/images/string/hash-step-3.svg" alt="字符串哈希第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：正向哈希和反向哈希可用于判回文。"><img src="../../assets/images/string/hash-step-4.svg" alt="字符串哈希第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：把字符串看成 P 进制数字。</div>
</div>

## 模板代码逐步解释

模板中 `h1` 是原字符串的前缀哈希，`h2` 是反转字符串的前缀哈希，`p` 是幂数组，满足 `p[k] = P^k mod mod`。

预处理正向哈希：

```python
h1.append((h1[-1] * P + ord(s[i]) - ord('a')) % mod)
```

表示把当前字符加入正向哈希。

预处理反向哈希：

```python
h2.append((h2[-1] * P + ord(s[n - i - 1]) - ord('a')) % mod)
```

表示从后往前读原串，相当于给反串建立前缀哈希。

获取正向子串哈希：

```python
def get1(l, r):
    return (h1[r] - h1[l - 1] * p[r - l + 1]) % mod
```

这里的 `l,r` 是 1-indexed，表示原字符串中的闭区间 \([l,r]\)。

获取反向哈希时：

```python
l, r = n - r + 1, n - l + 1
```

这是把原字符串中的区间 \([l,r]\) 映射到反串中的对应区间。原串越靠左的位置，在反串中越靠右。

## 为什么能判回文

如果一个子串是回文，那么它正着读和反着读相同。因此它的正向哈希应该等于反向哈希：

\[
get1(l,r)=get2(l,r)
\]

哈希相等只能说明“高度可能相等”，理论上存在冲突。实际竞赛中常用大模数、双哈希等方式降低冲突概率。

## 代码模板

```python
s = 'aababa'
mod = 10 ** 9 + 7
P = 26
h1 = [0]  # 正向哈希
h2 = [0]  # 反向哈希
n = len(s)
p = [1]    # 幂数数组

# 预处理哈希值和幂
for i in range(n):
    h1.append((h1[-1] * P + ord(s[i]) - ord('a')) % mod)
    h2.append((h2[-1] * P + ord(s[n - i - 1]) - ord('a')) % mod)
    p.append((p[-1] * P) % mod)

# 正向哈希：获取子串[l,r]的哈希值
def get1(l, r):
    return (h1[r] - h1[l - 1] * p[r - l + 1]) % mod

# 反向哈希：获取子串[l,r]的反向哈希值
def get2(l, r):
    l, r = n - r + 1, n - l + 1
    return (h2[r] - h2[l - 1] * p[r - l + 1]) % mod

# 字符串哈希可以判回文
for l in range(1, n + 1):
    for r in range(l, n + 1):
        # (l,r) >= 1
        t = s[l - 1:r]
        rs1 = get1(l, r)
        rs2 = get2(l, r)
        print(t, rs1, rs2, rs1 == rs2, t == t[::-1])
```

## 复杂度

预处理为 \(O(n)\)，每次查询子串哈希为 \(O(1)\)。

## 易错点

- 模板中的 `get1(l,r)` 和 `get2(l,r)` 使用 1-indexed。
- Python 中取模后仍然建议写 `% mod`，避免出现负值影响比较。
- 哈希有冲突概率；重要场景可以使用双模数或更大的随机底数。
