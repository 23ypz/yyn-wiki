# 组合数学

组合数学常用于计数问题，例如排列、组合、容斥、生成函数等。

## 组合数

组合数表示从 $n$ 个元素中选出 $k$ 个元素的方案数：

$$
\binom{n}{k} = \frac{n!}{k!(n-k)!}
$$

## Pascal 递推

$$
\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}
$$

```cpp
const int N = 1000;
long long C[N + 1][N + 1];

void init() {
    for (int i = 0; i <= N; i++) {
        C[i][0] = C[i][i] = 1;
        for (int j = 1; j < i; j++) {
            C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
        }
    }
}
```
