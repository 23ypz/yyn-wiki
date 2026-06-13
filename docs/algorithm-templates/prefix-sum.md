---
tags:
  - yyn
  - 算法模板
---

# 前缀和
**算法介绍：**
前缀和是一种预处理技术，通过预先计算数组前缀的和，使得区间查询的时间复杂度从O(n)优化到O(1)。一维前缀和处理一维数组，二维前缀和处理二维矩阵。

**应用场景：**
- 快速查询数组区间和
- 统计满足某些条件的子数组数量
- 二维矩阵的子矩阵和查询

### 一维前缀和

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

### 二维前缀和

```python
a = [[1, 1, 1],
     [1, 1, 1],
     [1, 1, 1]]

n, m = len(a), len(a[0])
s = [[0] * (m + 1) for i in range(n + 1)]

# s[i][j]表示从坐标(1,1)到(i,j)的矩形和
# i,j >= 1
for i in range(n):
    for j in range(m):
        s[i + 1][j + 1] = s[i + 1][j] + s[i][j + 1] - s[i][j] + a[i][j]


def query(r1, c1, r2, c2):
    '''
    :param r1: 左上角横坐标(r1 >= 1)
    :param c1: 左上角纵坐标(c1 >= 1)
    :param r2: 右下角横坐标(r2 >= 1)
    :param c2: 右下角纵坐标(c2 >= 1)
    :return: 返回矩形区域之和
    '''
    return s[r2][c2] - s[r2][c1 - 1] - s[r1 - 1][c2] + s[r1 - 1][c1 - 1]


# 示例：查询矩形(1,1)到(2,3)的和
r1, c1 = 1, 1
r2, c2 = 2, 3
print(query(r1, c1, r2, c2))
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

