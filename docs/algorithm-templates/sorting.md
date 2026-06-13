---
tags:
  - yyn
  - 算法模板
---

# 排序
**算法介绍：**
排序是计算机科学中的基本操作，Python提供了强大的排序功能，包括内置排序和自定义排序。

**应用场景：**
- 数据整理
- 贪心算法预处理
- 二分查找预处理
- 统计分析

### 简单排序

```python
a = [1, 2, 3, 4, 5, 6]

# 直接将数组a升序排序
a.sort()

# 直接将数组a降序排序
a.sort(reverse=True)

b = [(1, 2), (2, 3), (1, 7), (2, 6), (0, 3)]

# 默认先按第一个值升序排序，第一个值相同的情况下按第二个值升序排序
b.sort()

# key关键字自定义排序
# 先按第二个值升序排序，再按第一个值升序排序
b.sort(key=lambda x: (x[1], x[0]))

# 先按第二个值降序排序，再按第一个值升序排序
b.sort(key=lambda x: -x[1])

# 不修改原数组的排序写法(将排序后的数组赋值给一个新数组)
c = sorted(b)  # 如要自定义排序，写法和sort一样

print("排序结果:", b)
print("新数组:", c)
```

### 内置函数自定义排序

```python
from functools import cmp_to_key

def cmp(a, b):
    '''
    :param a: 待排序的数a
    :param b: 待排序的数b
    :return: 返回1表示a要排在b的右边，返回-1表示a要排在b的左边
    '''
    if a > b:
        return 1
    if a < b:
        return -1
    return 0

a = [1, 2, 3, 4, 7, 2]

a.sort(key=cmp_to_key(cmp))
print("自定义排序结果:", a)
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

