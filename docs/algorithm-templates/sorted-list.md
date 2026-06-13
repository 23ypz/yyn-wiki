---
tags:
  - yyn
  - 算法模板
---

# 有序列表
**算法介绍：**
有序列表是一种支持高效插入、删除和查找操作的数据结构，它维护元素的有序性，使得这些操作的时间复杂度都相对较低。

**应用场景：**
- 需要频繁插入删除的有序数据
- 统计问题
- 区间查询
- 动态维护有序集合

### SortedList

```python
class SortedList:
    """高效的有序列表实现，支持O(log n)的插入、删除和查找操作"""
    def __init__(self, iterable=[], _load=200):
        """初始化有序列表"""
        values = sorted(iterable)
        self._len = _len = len(values)
        self._load = _load
        # 将数据分块存储，每块大小为_load
        self._lists = _lists = [values[i:i + _load] for i in range(0, _len, _load)]
        self._list_lens = [len(_list) for _list in _lists]
        self._mins = [_list[0] for _list in _lists]
        self._fen_tree = []  # Fenwick树用于快速定位
        self._rebuild = True

    def _fen_build(self):
        """构建Fenwick树"""
        self._fen_tree[:] = self._list_lens
        _fen_tree = self._fen_tree
        for i in range(len(_fen_tree)):
            if i | i + 1 < len(_fen_tree):
                _fen_tree[i | i + 1] += _fen_tree[i]
        self._rebuild = False

    def _fen_update(self, index, value):
        """更新Fenwick树"""
        if not self._rebuild:
            _fen_tree = self._fen_tree
            while index < len(_fen_tree):
                _fen_tree[index] += value
                index |= index + 1

    def _fen_query(self, end):
        """查询Fenwick树前缀和"""
        if self._rebuild:
            self._fen_build()
        _fen_tree = self._fen_tree
        x = 0
        while end:
            x += _fen_tree[end - 1]
            end &= end - 1
        return x

    def _fen_findkth(self, k):
        """找到第k个元素所在的块"""
        _list_lens = self._list_lens
        if k < _list_lens[0]:
            return 0, k
        if k >= self._len - _list_lens[-1]:
            return len(_list_lens) - 1, k + _list_lens[-1] - self._len
        if self._rebuild:
            self._fen_build()
        _fen_tree = self._fen_tree
        idx = -1
        for d in reversed(range(len(_fen_tree).bit_length())):
            right_idx = idx + (1 << d)
            if right_idx < len(_fen_tree) and k >= _fen_tree[right_idx]:
                idx = right_idx
                k -= _fen_tree[idx]
        return idx + 1, k

    def add(self, value):
        """添加元素到有序列表"""
        _load = self._load
        _lists = self._lists
        _mins = self._mins
        _list_lens = self._list_lens
        self._len += 1
        if _lists:
            pos, idx = self._loc_right(value)
            self._fen_update(pos, 1)
            _list = _lists[pos]
            _list.insert(idx, value)
            _list_lens[pos] += 1
            _mins[pos] = _list[0]
            # 如果当前块过大，分裂
            if _load + _load < len(_list):
                _lists.insert(pos + 1, _list[_load:])
                _list_lens.insert(pos + 1, len(_list) - _load)
                _mins.insert(pos + 1, _list[_load])
                _list_lens[pos] = _load
                del _list[_load:]
                self._rebuild = True
        else:
            _lists.append([value])
            _mins.append(value)
            _list_lens.append(1)
            self._rebuild = True

    def _loc_right(self, value):
        """定位value应该插入的位置"""
        if not self._len:
            return 0, 0
        _lists = self._lists
        _mins = self._mins
        pos, hi = 0, len(_lists)
        while pos + 1 < hi:
            mi = (pos + hi) >> 1
            if value < _mins[mi]:
                hi = mi
            else:
                pos = mi
        _list = _lists[pos]
        lo, idx = -1, len(_list)
        while lo + 1 < idx:
            mi = (lo + idx) >> 1
            if value < _list[mi]:
                idx = mi
            else:
                lo = mi
        return pos, idx

    def __len__(self):
        """返回有序列表的大小"""
        return self._len

    def __getitem__(self, index):
        """获取指定索引的元素"""
        pos, idx = self._fen_findkth(self._len + index if index < 0 else index)
        return self._lists[pos][idx]

    def __repr__(self):
        """返回有序列表的字符串表示"""
        return 'SortedList({0})'.format(list(self))

# 示例使用
a = [5, 3, 2, 5, 1, 2, 3, 5]
sc = SortedList(a)
print("初始有序列表:", sc)
sc.add(4)
print("添加4后:", sc)
sc.remove(3)  # 删除一个3
print("删除3后:", sc)
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

