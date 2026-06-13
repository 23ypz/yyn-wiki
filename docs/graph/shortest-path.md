# 最短路

最短路问题是图论中的经典问题：给定一张带权图，求从一个点到另一个点，或从一个点到所有点的最短距离。

## Dijkstra 算法

Dijkstra 算法适用于 **非负边权** 的单源最短路问题。

使用堆优化时，复杂度通常为：

$$
O(m \log n)
$$

其中 $n$ 是点数，$m$ 是边数。

```cpp
using PII = pair<int, int>;
const int INF = 1e9;

vector<vector<PII>> g;
vector<int> dist;

void dijkstra(int s) {
    priority_queue<PII, vector<PII>, greater<PII>> pq;
    dist.assign(g.size(), INF);
    dist[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d != dist[u]) continue;

        for (auto [v, w] : g[u]) {
            if (dist[v] > d + w) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
}
```

!!! warning "注意"
    如果图中存在负边权，不要直接使用 Dijkstra。
