---
tags:
  - yyn
  - 算法模板
---

# 数位DP
**算法介绍：**
数位DP是一种统计区间内满足某些条件的数字个数的技术，通过按位分析来解决问题。

**应用场景：**
- 统计区间内数字个数
- 数字和问题
- 数字组成问题

### 上下界数位DP

```python
from functools import lru_cache

def f(h):
    """统计小于等于h的满足条件的数字个数"""
    s = list(map(int, str(h)))
    n = len(s)

    @lru_cache(None)
    def dfs(i, is_num, is_limit, tar):
        """
        :param i: 当前处理的位置
        :param is_num: 是否已经开始填数字（处理前导零）
        :param is_limit: 是否受到上界限制
        :param tar: 根据题意修改的条件参数
        """
        if i == n:
            return is_num and tar  # 如果前导零对题目没有影响 则可以不用 is_num 参数
        
        up = s[i] if is_limit else 9
        
        if not is_num:
            # 还处于前导 0 状态  继续填 0
            res = dfs(i + 1, is_num, False, tar)
        else:
            res = dfs(i + 1, is_num, is_limit and up == 0, tar)

        for d in range(1, up + 1):
            res += dfs(i + 1, is_num, is_limit and d == up, tar)
        return res

    return dfs(0, False, True, 0)

def main(l, r):
    """统计区间[l,r]内满足条件的数字个数"""
    print(f(r) - f(l - 1))

# 示例使用
main(1, 100)
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

