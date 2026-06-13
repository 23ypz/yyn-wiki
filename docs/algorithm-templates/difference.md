---
tags:
  - yyn
  - 算法模板
---

# 差分
**算法介绍：**
差分是前缀和的逆运算，通过构建差分数组，可以将区间修改操作的时间复杂度从O(n)优化到O(1)。常用于处理大量的区间更新问题。

**应用场景：**
- 数组的区间增减操作
- 区间染色问题
- 差分数组的前缀和就是原数组

### 一维差分

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

### 二维差分

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

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

