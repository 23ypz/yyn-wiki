# 算法知识总览

本页用于快速定位知识库中的主要算法模块。为了避免总览页过长，这里只保留每个大类的入口和适用场景；具体公式、代码和图示请进入对应专题页面查看。

!!! note "使用方式"
    不确定某个算法属于哪一类时，可以先在本页按问题类型查找；已经知道算法名时，直接使用右上角搜索会更快。

## 基础算法

基础算法适合放在最前面复习，因为它们经常作为其他算法的前置步骤。

- [基础总览](basic.md)：二分、排序、位运算的整体说明。
- [基础二分](binary-search-basic.md)：在有序数组中查找边界。
- [二分答案](binary-search-answer.md)：在答案空间上二分，通过 `check` 判断可行性。
- [简单排序](sorting-basic.md)：`sort`、`sorted`、`key` 和多关键字排序。
- [自定义排序](sorting-custom.md)：使用 `cmp_to_key` 处理复杂比较规则。
- [线性基](xor-basis.md)：维护异或线性空间，求最大异或值。

## 前缀和与差分

前缀和用于快速查询区间信息，差分用于快速处理区间修改。

- [前缀和与差分总览](prefix-difference.md)
- [一维前缀和](prefix-sum-1d.md)
- [二维前缀和](prefix-sum-2d.md)
- [一维差分](difference-1d.md)
- [二维差分](difference-2d.md)

## 数据结构

数据结构专题用于整理高频维护类问题。重点不是背代码，而是理解每种结构维护的信息和支持的操作。

- [数据结构总览](data-structures.md)
- [普通并查集](dsu-basic.md) / [带权并查集](dsu-weighted.md)
- [对顶堆](two-heaps.md) / [懒删除堆](lazy-heap.md)
- [单调栈](monotonic-stack.md) / [单调队列](monotonic-queue.md)
- [SortedList](sorted-list.md)
- [树状数组](fenwick-tree.md) / [区间修改区间求和树状数组](fenwick-range.md)
- [线段树](segment-tree.md) / [Lazy 线段树](lazy-segment-tree.md) / [ST 表](sparse-table.md)

## 图论与树

图论与树专题适合按“遍历、最短路、树上查询”三条线复习。

- [图论与树总览](graph-tree.md)
- BFS：[网格 BFS](grid-bfs.md)、[无权图最短路](unweighted-shortest-path.md)
- DFS：[连通块大小](connected-components.md)、[二分图染色](bipartite-coloring.md)、[图上 DFS](graph-dfs.md)
- 最短路：[Dijkstra](dijkstra.md)、[Floyd](floyd.md)、[可加边 Dijkstra](add-edge-dijkstra.md)、[可加边 Floyd](add-edge-floyd.md)
- 树上问题：[LCA 倍增](lca-binary-lifting.md)、[带权树 LCA](weighted-lca.md)、[树上差分](tree-difference.md)

## 动态规划

动态规划专题按状态形式划分。阅读时建议先理解状态定义，再看转移公式。

- [动态规划总览](dynamic-programming.md)
- [简单 DP](simple-dp.md)
- [背包 DP](knapsack-dp.md)
- [区间 DP](interval-dp.md)
- [树形 DP](tree-dp.md)
- [数位 DP](digit-dp.md)

## 数学

数学专题主要整理数论和组合计数中的常用模板。

- [数学总览](number-theory.md)
- [快速幂](fast-power.md)
- [最大公约数](gcd.md) / [最小公倍数](lcm.md)
- [矩阵快速幂](matrix-fast-power.md)
- [组合数](combination.md)
- [质因数分解](prime-factorization.md)
- [质数筛](prime-sieve.md)
- [逆元](modular-inverse.md)

## 字符串

字符串专题适合按“匹配、前缀信息、哈希、Trie”来整理。

- [字符串总览](string.md)
- [KMP](kmp.md)
- [Z 函数](z-function.md)
- [字符串哈希](string-hash.md)
- [Trie](trie.md)
- [01 Trie](binary-trie.md)

## 如何扩展这个知识库

新增算法时，建议同时补充以下内容：经典例题、核心思想、公式或不变量、完整代码模板、复杂度分析和易错点。对于运行过程比较复杂的算法，可以增加手动轮播图，方便复习时按步骤理解。
