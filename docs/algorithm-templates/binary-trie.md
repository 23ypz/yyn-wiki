# 01 Trie

01 Trie 是 Trie 在二进制上的应用。它把整数从高位到低位拆成 0/1 路径，常用于最大异或、最小异或等问题。

## 例题：数组中两个数的最大异或值

!!! example "例题"
    给定数组 `nums`，求：

    \[
    \max_{i,j}(nums[i]\oplus nums[j])
    \]

## 为什么要从高位到低位

二进制数的高位权值更大。例如第 \(i\) 位的贡献是：

\[
2^i
\]

如果想让异或值最大，就应该优先让更高位变成 1。因为高位一旦为 1，带来的收益比所有低位加起来还重要。

异或规则是：

- 相同为 0；
- 不同为 1。

因此对于当前数字 `x` 的某一位 `bit`，最优选择是去 Trie 中找 `bit ^ 1`，也就是相反位。

## 插入过程怎么来的

模板中每个节点有两个儿子：

```python
self.son = [None, None]
```

分别表示当前位走 `0` 或走 `1`。

插入数字 `x` 时：

```python
for i in range(30, -1, -1):
    bit = x >> i & 1
```

从第 30 位到第 0 位逐位取出二进制位。每一位都作为 Trie 的一层。如果对应儿子不存在，就新建节点。

为什么是 `30` 到 `0`？这是为了覆盖常见非负整数范围。如果题目数据更大，例如到 \(10^{18}\)，需要改成从 `60` 开始。

## 查询最大异或怎么来的

查询 `x` 时，也从高位到低位走。当前位为 `bit = x >> i & 1`。

如果 Trie 中存在相反位 `cur.son[bit ^ 1]`，就优先走相反位，因为这样当前位异或结果为 1。于是答案加上这一位的贡献：

```python
ans |= (1 << i)
```

如果相反位不存在，只能走相同位，当前位异或结果为 0。

## 图示：按位贪心

<div class="yyn-carousel" tabindex="0" aria-label="01 Trie 最大异或过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：从最高位开始处理。"><img src="../../assets/images/string/01trie-step-1.svg" alt="01 Trie 第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：当前位为 1 时，优先寻找 0 分支。"><img src="../../assets/images/string/01trie-step-2.svg" alt="01 Trie 第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：如果相反位存在，当前位异或结果为 1。"><img src="../../assets/images/string/01trie-step-3.svg" alt="01 Trie 第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：如果相反位不存在，只能走相同位。"><img src="../../assets/images/string/01trie-step-4.svg" alt="01 Trie 第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：从最高位开始处理。</div>
</div>

## 代码模板

```python
class Node:
    __slots__ = 'son'

    def __init__(self):
        self.son = [None, None]  # 两个子节点，分别表示0和1

class Trie:
    """01字典树，用于异或相关操作"""
    def __init__(self):
        self.root = Node()

    def insert(self, x):
        """插入数字x到01字典树中"""
        cur = self.root
        for i in range(30, -1, -1):  # 从高位到低位处理，共31位（处理int范围）
            bit = x >> i & 1
            if cur.son[bit] is None:
                cur.son[bit] = Node()
            cur = cur.son[bit]

    def max_xor(self, x):
        """查找与x异或结果最大的数"""
        cur = self.root
        ans = 0
        for i in range(30, -1, -1):
            bit = x >> i & 1
            # 优先选择相反的位，这样异或结果为1
            if cur.son[bit ^ 1]:
                ans |= (1 << i)
                bit ^= 1
            cur = cur.son[bit]
        return ans

# 返回nums[i] ^ nums[j]的最大运算结果
nums = [3, 10, 5, 25, 2, 8]
tr = Trie()
for x in nums:
    tr.insert(x)
print("最大XOR值:", max(tr.max_xor(x) for x in nums))
```

## 这个模板返回的是什么

`max_xor(x)` 返回的是：已插入数字中，某个数与 `x` 异或后能得到的最大异或值。

它不是返回那个“配对数字”本身。如果题目需要返回配对数字，可以在查询过程中把走过的位也记录下来。

## 复杂度

设整数二进制位数为 \(B\)。

- 插入一个数：\(O(B)\)
- 查询一个数：\(O(B)\)
- 对所有数求最大异或：\(O(nB)\)

模板中 \(B=31\)，所以通常可以看作线性。

## 易错点

- 要从高位往低位贪心，不能从低位开始。
- 数据范围如果超过 \(2^{31}\)，要把 `range(30,-1,-1)` 改大。
- 如果 Trie 为空就查询会报错，应先插入至少一个数。
