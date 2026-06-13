---
tags:
  - yyn
  - 算法模板
---

# 字符串基础
**算法介绍：**
字符串算法是计算机科学中的重要分支，包括模式匹配、字符串处理、字典树等。

**应用场景：**
- 文本搜索
- 模式匹配
- 前缀/后缀处理
- 字符串编码

### KMP算法

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

### Z函数

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

### 字符串哈希

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

### 普通字典树

```python
class Node:
    __slots__ = 'son', 'end'

    def __init__(self):
        self.son = {}
        self.end = False

class Trie:
    """普通字典树，用于字符串匹配"""
    def __init__(self):
        self.root = Node()

    def insert(self, word):
        """插入单词"""
        cur = self.root
        for c in word:
            if c not in cur.son:
                cur.son[c] = Node()
            cur = cur.son[c]
        cur.end = True

    def find(self, word):
        """查找单词，返回状态"""
        cur = self.root
        for c in word:
            if c not in cur.son:
                return 0
            cur = cur.son[c]
        # 1 表示前缀    2 表示匹配到完整的字符串
        return 2 if cur.end else 1

    def search(self, word):
        """搜索单词是否存在"""
        return self.find(word) != 0

# 示例使用
n, m = 5, 3
g = ['aaa', 'aba', 'aabbaa', 'abbbbb', 'cdd']
que = ['aabba', 'abc', 'abab']

tr = Trie()
for s in g:
    tr.insert(s)
for s in que:
    if tr.search(s):
        print("yes")
    else:
        print("no")
```

### 01字典树

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

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

