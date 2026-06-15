# Trie

Trie 又叫字典树，用于维护字符串集合。每条边表示一个字符，从根到某个节点的路径表示一个前缀。

## 例题：单词查询

!!! example "例题"
    给定若干单词，再给出若干查询，判断查询串是否是某个已插入单词，或者是否是某个单词的前缀。

## Trie 的结构

Trie 的根节点不表示任何字符。从根出发，每走过一条字符边，就相当于在当前前缀后面追加一个字符。

例如插入 `abc` 和 `abd`，它们会共享前缀 `ab`，只在最后一个字符处分叉。所以 Trie 的优势是：大量字符串有共同前缀时，可以把这些共同部分合并存储。

## Node 为什么这样设计

模板中：

```python
class Node:
    __slots__ = 'son', 'end'
```

每个节点包含两个信息：

- `son`：当前节点向下的字符边；
- `end`：是否有某个完整单词在当前节点结束。

`son` 使用字典，是因为字符集不一定固定。如果只处理小写字母，也可以用长度为 26 的数组。

## 插入过程怎么来的

插入单词 `word` 时，从根开始依次处理字符。

对于当前字符 `c`：

1. 如果 `c` 不在当前节点的 `son` 中，说明之前没有这个前缀，需要新建节点；
2. 然后移动到 `c` 对应的子节点；
3. 所有字符处理完后，当前节点代表整个单词，设置 `end=True`。

## 图示：插入与查询

<div class="yyn-carousel" tabindex="0" aria-label="Trie 字典树过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：根节点是所有字符串的起点。"><img src="../../assets/images/string/trie-step-1.svg" alt="Trie 第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：插入时按照字符逐层向下走。"><img src="../../assets/images/string/trie-step-2.svg" alt="Trie 第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：单词结尾要打 end 标记。"><img src="../../assets/images/string/trie-step-3.svg" alt="Trie 第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：查询时走不到边就是不存在，走完后看 end。"><img src="../../assets/images/string/trie-step-4.svg" alt="Trie 第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：根节点是所有字符串的起点。</div>
</div>

## 查询过程怎么来的

查询 `word` 时，也从根开始按字符走。

- 如果某个字符边不存在，说明没有任何已插入字符串包含这个前缀，返回 `0`；
- 如果所有字符都能走完，说明查询串至少是某个字符串的前缀；
- 如果最后节点 `end=True`，说明查询串本身就是完整单词。

所以模板中 `find` 返回：

```python
0：完全不存在
1：是前缀，但不是完整单词
2：匹配到完整字符串
```

注意模板里的 `search` 表示“只要是前缀或完整单词就返回 True”。如果题目要求必须是完整单词，可以改成 `return self.find(word) == 2`。

## 代码模板

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

## 复杂度

设字符串长度为 \(L\)。

- 插入：\(O(L)\)
- 查询：\(O(L)\)
- 空间复杂度：与所有插入字符串的总长度有关。

## 易错点

- `end=True` 只表示完整单词结束，不代表没有子节点。
- 一个字符串可以既是完整单词，又是另一个单词的前缀。
- `search` 的语义要看题目：查完整单词还是查前缀。
