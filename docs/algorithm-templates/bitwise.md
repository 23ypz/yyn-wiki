---
tags:
  - yyn
  - 算法模板
---

# 位运算
**算法介绍：**
位运算是对二进制位进行操作的技巧，在算法竞赛中常用于优化和特殊问题的求解。

**应用场景：**
- 状态压缩DP
- 快速计算
- 位操作技巧
- 线性基

### 线性基

```python
class XorBasis:
    """线性基，用于求解子序列最大XOR值"""
    # n 为值域最大值 U 的二进制长度，例如 U=1e9 时 n=30
    def __init__(self, n: int):
        self.b = [0] * n

    def insert(self, x: int) -> None:
        """插入数字到线性基中"""
        b = self.b
        # 从高到低遍历，保证计算 max_xor 的时候，参与 XOR 的基的最高位（或者说二进制长度）是互不相同的
        for i in range(len(b) - 1, -1, -1):
            if x >> i:  # 由于大于 i 的位都被我们异或成了 0，所以 x >> i 的结果只能是 0 或 1
                if b[i] == 0:  # x 和之前的基是线性无关的
                    b[i] = x  # 新增一个基，最高位为 i
                    return
                x ^= b[i]  # 保证每个基的二进制长度互不相同
        # 正常循环结束，此时 x=0，说明一开始的 x 可以被已有基表出，不是一个线性无关基

    def max_xor(self) -> int:
        """求能得到的最大XOR值"""
        b = self.b
        res = 0
        # 从高到低贪心：越高的位，越必须是 1
        # 由于每个位的基至多一个，所以每个位只需考虑异或一个基，若能变大，则异或之
        for i in range(len(b) - 1, -1, -1):
            if res ^ b[i] > res:  # 手写 max 更快
                res ^= b[i]
        return res

# 示例使用
xor_basis = XorBasis(30)  # 假设数值范围在2^30内
nums = [1, 2, 3, 4, 5]
for num in nums:
    xor_basis.insert(num)

print("最大XOR值:", xor_basis.max_xor())
```

---

!!! info "来源"
    本页由你上传的 `算法模板总结.md` 拆分整理而来，便于在知识库中导航和搜索。

