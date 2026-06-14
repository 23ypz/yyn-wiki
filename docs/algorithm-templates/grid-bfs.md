# 网格 BFS

网格 BFS 常用于迷宫、地图、棋盘等问题。每个格子可以看作图中的一个点，相邻可走格子之间有一条边。由于每一步代价相同，最短步数可以直接用 BFS 求出。

## 例题：迷宫最短路

!!! example "例题：从起点走到终点"
    给定一个 $n\times m$ 的网格，`.` 表示可以通行，`#` 表示障碍。每次可以向上、下、左、右移动一格，求从起点到终点的最少步数。若无法到达，输出 $-1$。

## 思路

BFS 的关键是“按层扩展”。从起点开始，先访问距离为 $1$ 的点，再访问距离为 $2$ 的点。第一次访问到某个格子时，得到的距离一定是最短距离。

如果当前格子为 $(x,y)$，相邻格子为 $(nx,ny)$，那么距离转移为：

$$
\operatorname{dis}[nx][ny] = \operatorname{dis}[x][y] + 1
$$

前提是新格子在边界内、不是障碍、并且没有被访问过。

## 图示：按层扩展过程

下面用手动轮播图展示 BFS 在一个小网格上的扩展过程。你可以把它理解为：**队列中的点是一层一层推进的，当前层全部处理完后，下一层的距离统一加一。**

<div class="yyn-carousel" tabindex="0" aria-label="网格 BFS 过程手动轮播">
  <div class="yyn-carousel-viewport">
    <div class="yyn-carousel-slide" data-caption="第 1 步：起点先入队，距离初始化为 0。"><img src="../../assets/images/graph-tree/bfs-step-1.svg" alt="网格 BFS 第 1 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 2 步：从起点向四个方向扩展，得到第一层。"><img src="../../assets/images/graph-tree/bfs-step-2.svg" alt="网格 BFS 第 2 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 3 步：继续处理队列，所有新入队的点距离都比当前层大 1。"><img src="../../assets/images/graph-tree/bfs-step-3.svg" alt="网格 BFS 第 3 步"></div>
    <div class="yyn-carousel-slide" data-caption="第 4 步：终点第一次被访问时，对应的就是最短步数。"><img src="../../assets/images/graph-tree/bfs-step-4.svg" alt="网格 BFS 第 4 步"></div>
  </div>
  <div class="yyn-carousel-toolbar">
    <button class="yyn-carousel-prev" type="button" aria-label="上一张">‹</button>
    <span class="yyn-carousel-counter" aria-live="polite">1 / 4</span>
    <button class="yyn-carousel-next" type="button" aria-label="下一张">›</button>
  </div>
  <div class="yyn-carousel-caption">第 1 步：起点先入队，距离初始化为 0。</div>
</div>

## 代码模板

```python
from collections import deque


def grid_bfs(grid, start, target):
    """返回 start 到 target 的最短步数，不可达返回 -1。

    grid: List[str]，'.' 可走，'#' 障碍
    start / target: (x, y)，0-indexed
    """
    n, m = len(grid), len(grid[0])
    sx, sy = start
    tx, ty = target

    if grid[sx][sy] == '#' or grid[tx][ty] == '#':
        return -1

    dis = [[-1] * m for _ in range(n)]
    dis[sx][sy] = 0
    q = deque([(sx, sy)])
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while q:
        x, y = q.popleft()
        if (x, y) == (tx, ty):
            return dis[x][y]

        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < m:
                if grid[nx][ny] != '#' and dis[nx][ny] == -1:
                    dis[nx][ny] = dis[x][y] + 1
                    q.append((nx, ny))

    return -1
```
