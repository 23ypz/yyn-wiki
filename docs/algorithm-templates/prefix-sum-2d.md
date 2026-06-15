# 二维前缀和

二维前缀和用于快速查询矩阵中任意子矩形的元素和。它是一维前缀和在二维平面上的推广。

## 例题：多次子矩形求和

!!! example "例题"
    给定一个 \(n\times m\) 的矩阵，有 \(q\) 次询问，每次给出左上角 \((r_1,c_1)\) 和右下角 \((r_2,c_2)\)，求这个子矩形内所有元素之和。

## 原理

定义：

\[
s[i][j]=\sum_{x=1}^{i}\sum_{y=1}^{j}a[x][y]
\]

也就是 \(s[i][j]\) 表示从左上角 \((1,1)\) 到 \((i,j)\) 的矩形和。

构建时，\(s[i-1][j]\) 表示上方矩形，\(s[i][j-1]\) 表示左方矩形，而 \(s[i-1][j-1]\) 是被重复计算的左上角部分，所以要减掉一次：

\[
s[i][j]=s[i-1][j]+s[i][j-1]-s[i-1][j-1]+a[i][j]
\]

查询矩形 \((r_1,c_1)\) 到 \((r_2,c_2)\) 时：

\[
ans=s[r_2][c_2]-s[r_1-1][c_2]-s[r_2][c_1-1]+s[r_1-1][c_1-1]
\]

这个公式本质上是容斥：大矩形减去上方和左方，多减的左上角公共部分再加回来。

## 图示：二维容斥

<div class="yyn-carousel" tabindex="0" aria-label="二维前缀和过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：s[i][j] 表示从左上角到当前位置的矩形和。"><img src="../../assets/images/prefix-difference/prefix-2d-step-1.svg" alt="二维前缀和第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：构建 s[i][j] 时，上方和左方重复包含左上角，需要减去一次。"><img src="../../assets/images/prefix-difference/prefix-2d-step-2.svg" alt="二维前缀和第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：查询子矩形时，先取右下大矩形，再减去上方和左方。"><img src="../../assets/images/prefix-difference/prefix-2d-step-3.svg" alt="二维前缀和第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：左上角公共部分被减了两次，所以要加回来。"><img src="../../assets/images/prefix-difference/prefix-2d-step-4.svg" alt="二维前缀和第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar"><button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button><span class="yyn-carousel-counter" aria-live="polite">1 / 4</span><button class="yyn-carousel-next" type="button" aria-label="下一张">›</button></div>
  <div class="yyn-carousel-caption">第 1 步：s[i][j] 表示从左上角到当前位置的矩形和。</div>
</div>

## 代码模板

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

## 复杂度

- 预处理：\(O(nm)\)
- 单次查询：\(O(1)\)
- 空间复杂度：\(O(nm)\)

## 易错点

- 推荐多开一行一列，让第 0 行和第 0 列作为边界。
- 查询公式里最后一项是加号，不是减号。
- 坐标要统一，模板中查询参数使用 1-indexed。
