# KMP

KMP 用于在主串 `s` 中查找模式串 `t` 的出现位置或出现次数。相比暴力匹配，KMP 的关键优势是：**失配时不回退主串指针**，而是利用模式串自身的前后缀信息移动模式串。

## 例题：统计模式串出现次数

!!! example "例题"
    给定主串 `s` 和模式串 `t`，求 `t` 在 `s` 中出现了多少次。允许重叠出现。

## 为什么暴力匹配会慢

暴力匹配在某个位置失配后，会把主串起点右移一位，然后从模式串开头重新匹配。问题在于：已经比较过的字符信息被浪费了。

例如模式串前面已经匹配了一段：

```text
t[0..j-1]
```

现在在 `t[j]` 处失配。KMP 思考的是：已经匹配成功的这一段内部，是否存在一个“后缀”可以继续当作下一轮匹配的“前缀”。

如果存在，就不需要把 `j` 退回 0，而是退到某个更短的可复用长度。

## nxt 数组含义

本模板中：

```python
nxt[i]
```

表示模式串 `t[:i]` 的最长相等真前后缀长度。

也就是说，对于长度为 `i` 的前缀 `t[:i]`，如果存在最大长度 `k`，满足：

\[
t[0:k] = t[i-k:i]
\]

那么：

\[
nxt[i]=k
\]

注意这里的 `nxt[i]` 对应的是长度为 `i` 的前缀，不是下标 `i` 的字符。

## nxt 数组是怎么推出来的

假设现在要计算 `nxt[i+1]`，也就是前缀 `t[:i+1]` 的最长相等真前后缀。

如果已经知道 `nxt[i]`，设：

```python
j = nxt[i]
```

这表示 `t[:i]` 的最长可复用前后缀长度是 `j`。现在多看一个字符 `t[i]`：

- 如果 `t[i] == t[j]`，说明原来的长度 `j` 可以继续扩展一位，因此：

  \[
  nxt[i+1]=j+1
  \]

- 如果 `t[i] != t[j]`，说明长度 `j` 这个候选前后缀不能用了，需要继续缩短到：

  \[
  j=nxt[j]
  \]

  然后继续尝试匹配。

这就是代码里的：

```python
while j and t[i] != t[j]:
    j = nxt[j]
```

它的意思不是随便跳，而是：当前候选前后缀失败后，继续尝试更短的、仍然可能成立的前后缀。

## 图示：匹配与失配跳转

<div class="yyn-carousel" tabindex="0" aria-label="KMP 匹配过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：先对模式串计算 nxt 数组。"><img src="../../assets/images/string/kmp-step-1.svg" alt="KMP 第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：匹配成功时，主串和模式串指针一起右移。"><img src="../../assets/images/string/kmp-step-2.svg" alt="KMP 第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：失配时，主串指针不回退，模式串指针跳到 nxt[j]。"><img src="../../assets/images/string/kmp-step-3.svg" alt="KMP 第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：完整匹配后答案加一，并继续寻找重叠匹配。"><img src="../../assets/images/string/kmp-step-4.svg" alt="KMP 第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：先对模式串计算 nxt 数组。</div>
</div>

## 匹配过程是怎么来的

匹配主串 `s` 时，变量 `j` 表示当前已经匹配了模式串前 `j` 个字符。也就是说：

```text
t[0..j-1]
```

已经和主串当前位置之前的一段匹配成功。

当读到主串字符 `s[i]` 时：

1. 如果 `s[i] == t[j]`，说明可以继续向后匹配，执行 `j += 1`。
2. 如果 `s[i] != t[j]`，说明当前长度 `j` 不可行，但已经匹配的部分仍然可能有后缀可以复用，所以执行 `j = nxt[j]`。
3. 如果 `j == len(t)`，说明完整匹配到一次，答案加一。
4. 完整匹配后不能简单把 `j` 归零，因为可能存在重叠匹配，所以继续令 `j = nxt[j]`。

例如在 `aaaa` 中查找 `aa`，匹配位置是 1、2、3，重叠出现。如果完整匹配后直接清零，就会漏掉重叠答案。

## 代码模板

```python
mx = 100010
nxt = [0] * mx

def get_nxt(t):
    """计算next数组，即最长公共前后缀"""
    for i in range(1, len(t)):
        j = nxt[i]
        while j and t[i] != t[j]:
            j = nxt[j]
        if t[i] == t[j]:
            nxt[i + 1] = j + 1
        else:
            nxt[i + 1] = 0

def kmp(s, t):
    """返回s中t出现的次数"""
    ans = 0
    j = 0
    for i in range(len(s)):
        while j and s[i] != t[j]:
            j = nxt[j]
        if s[i] == t[j]:
            j += 1
        if j == len(t):
            ans += 1
            j = nxt[j]
    return ans

# 示例使用
t = 'a'
s = 'aaaa'
get_nxt(t)
print("模式串出现次数:", kmp(s, t))
```

## 复杂度

构造 `nxt` 数组是 \(O(|t|)\)，匹配过程是 \(O(|s|)\)，总复杂度为：

\[
O(|s|+|t|)
\]

## 易错点

- `nxt[i]` 表示长度为 `i` 的前缀，不要和字符下标混淆。
- 完整匹配后要 `j = nxt[j]`，否则会漏掉重叠匹配。
- 多组数据时，最好重新初始化 `nxt` 中会用到的部分。
