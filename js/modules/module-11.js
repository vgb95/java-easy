(() => {
MODULES.push({
  id: 11, icon: '🏆', title: 'LeetCode Mastery — FAANG',
  desc: 'Trees, Graphs, DP avanzado, Sliding Window, Backtracking, Tries, Union-Find, Heap, Greedy, Bit Manipulation, Design',
  lessons: [
    {id:'11-01',title:'Trees — BST, AVL, Tries, Segment Tree',
content:`<h1>🌳 Árboles: de BST a Segment Tree</h1>
<h3>Binary Search Tree — propiedades invariantes</h3>
<div class="code-block"><pre><span class="cm">// In-order traversal de BST da elementos ordenados — O(n)</span>
<span class="cm">// Buscar: O(log n) promedio, O(n) peor (sesgado)</span>
<span class="cm">// Insertar: O(log n) promedio</span>

<span class="cm">// Validar BST — clásico de entrevista</span>
<span class="kw">boolean</span> esValido(<span class="typ">TreeNode</span> n, <span class="kw">long</span> min, <span class="kw">long</span> max) {
    <span class="kw">if</span> (n == <span class="kw">null</span>) <span class="kw">return</span> <span class="kw">true</span>;
    <span class="kw">if</span> (n.val <= min || n.val >= max) <span class="kw">return</span> <span class="kw">false</span>;
    <span class="kw">return</span> esValido(n.left, min, n.val) && esValido(n.right, n.val, max);
}</pre></div>
<h3>📐 Trie (Prefix Tree) — búsqueda de palabras en O(L)</h3>
<div class="code-block"><pre><span class="kw">class</span> <span class="typ">TrieNode</span> {
    <span class="typ">TrieNode</span>[] hijos = <span class="kw">new</span> <span class="typ">TrieNode</span>[<span class="num">26</span>];
    <span class="kw">boolean</span> fin = <span class="kw">false</span>;
}
<span class="cm">// Usos: autocomplete, spell checker, IP routing, word search</span>
<span class="cm">// Ventaja: O(L) tiempo por operación, independiente del número de palabras</span>
<span class="cm">// Desventaja: memoria (cada nodo tiene 26 referencias)</span></pre></div>
<h3>🎯 Segment Tree — queries de rango en O(log n)</h3>
<p>Problemas típicos: suma/mín/máximo en rango con actualizaciones. Usado en problemas como Range Sum Query Mutable.</p>
<div class="code-block"><pre><span class="cm">// Build: O(n)</span>
<span class="cm">// Query: O(log n)</span>
<span class="cm">// Update: O(log n)</span>
<span class="cm">// Alternativa: Fenwick Tree (Binary Indexed Tree) — menos memoria, más simple</span></pre></div>
<h3>💡 Patrones de árbol para entrevistas</h3>
<table class="comp-table"><tr><th>Patrón</th><th>Recursión</th><th>Iterativo</th><th>Complejidad</th></tr>
<tr><td>DFS (pre/in/post)</td><td>Simple</td><td>Stack explícito</td><td>O(n)</td></tr>
<tr><td>BFS (level order)</td><td>Difícil</td><td>Queue</td><td>O(n)</td></tr>
<tr><td>Morris traversal</td><td>No aplica</td><td>Sin stack, O(1) espacio</td><td>O(n)</td></tr>
<tr><td>Lowest Common Ancestor</td><td>Recursión</td><td>Stack con parent map</td><td>O(n)</td></tr>
<tr><td>Serialize/Deserialize</td><td>DFS con marcador null</td><td>BFS como array</td><td>O(n)</td></tr>
</table>
<p><strong>Morris traversal</strong>: clave para entrevistas — recorre el árbol en in-order usando O(1) espacio extra. Enlaza temporalmente nodos hoja a su sucesor in-order.</p>`,
exercise:{prompt:'¿Qué complejidad tiene el peor caso de búsqueda en BST sin balancear?',
code:'// Para una lista enlazada insertada secuencialmente',answer:'O(n) — árbol degenera en lista enlazada'}},

    {id:'11-02',title:'Graphs — BFS, DFS, Dijkstra, Topological Sort, Union-Find',
content:`<h1>🕸️ Grafos: el patrón más versátil</h1>
<h3>Representaciones (tradeoffs)</h3>
<table class="comp-table"><tr><th></th><th>Adjacency Matrix</th><th>Adjacency List</th><th>Edge List</th></tr>
<tr><td>Espacio</td><td>O(V²)</td><td>O(V+E)</td><td>O(E)</td></tr>
<tr><td>Chequear arista (u,v)</td><td>O(1)</td><td>O(degree(v))</td><td>O(E)</td></tr>
<tr><td>Recorrer vecinos</td><td>O(V)</td><td>O(degree(v))</td><td>O(E)</td></tr>
<tr><td>Mejor para</td><td>Grafos densos (completos)</td><td>Grafos dispersos (reales)</td><td>Kruskal MST</td></tr>
</table>
<h3>📐 Dijkstra — shortest path en O(E log V)</h3>
<div class="code-block"><pre><span class="cm">// Dijkstra con PriorityQueue — no funciona con pesos negativos</span>
<span class="typ">PriorityQueue</span>&lt;<span class="kw">int</span>[]&gt; pq = <span class="kw">new</span> <span class="typ">PriorityQueue</span>&lt;&gt;(<span class="typ">Comparator</span>.comparingInt(a -> a[<span class="num">1</span>]));
pq.offer(<span class="kw">new int</span>[]{start, <span class="num">0</span>});
<span class="kw">int</span>[] dist = <span class="kw">new int</span>[n];
<span class="typ">Arrays</span>.fill(dist, <span class="typ">Integer</span>.MAX_VALUE);
dist[start] = <span class="num">0</span>;

<span class="kw">while</span> (!pq.isEmpty()) {
    <span class="kw">int</span>[] cur = pq.poll();
    <span class="kw">int</span> u = cur[<span class="num">0</span>], d = cur[<span class="num">1</span>];
    <span class="kw">if</span> (d > dist[u]) <span class="kw">continue</span>;  <span class="cm">// stale entry</span>
    <span class="kw">for</span> (<span class="kw">int</span>[] edge : graph[u]) {
        <span class="kw">int</span> v = edge[<span class="num">0</span>], w = edge[<span class="num">1</span>];
        <span class="kw">if</span> (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.offer(<span class=\"kw\">new int</span>[]{v, dist[v]});
        }
    }
}</pre></div>
<h3>🎯 Topological Sort — Kahn's algorithm (BFS) vs DFS</h3>
<p>Kahn: cuenta indegree, procesa nodos con indegree=0. Si no procesa todos → hay ciclo.</p>
<h3>🔗 Union-Find (Disjoint Set Union) — O(α(n)) casi constante</h3>
<div class="code-block"><pre><span class=\"cm\">// Con path compression + union by rank — casi O(1)</span>
<span class=\"kw\">int</span> find(<span class=\"kw\">int</span> x) {
    <span class=\"kw\">if</span> (parent[x] != x) parent[x] = find(parent[x]);
    <span class=\"kw\">return</span> parent[x];
}
<span class=\"kw\">void</span> union(<span class=\"kw\">int</span> x, <span class=\"kw\">int</span> y) {
    <span class=\"kw\">int</span> rx = find(x), ry = find(y);
    <span class=\"kw\">if</span> (rx == ry) <span class=\"kw\">return</span>;
    <span class=\"kw\">if</span> (rank[rx] < rank[ry]) parent[rx] = ry;
    <span class=\"kw\">else if</span> (rank[rx] > rank[ry]) parent[ry] = rx;
    <span class=\"kw\">else</span> { parent[ry] = rx; rank[rx]++; }
}</pre></div>
<p>Usos: detectar ciclos en grafo no dirigido, Number of Islands (variante), Kruskal MST, ecuaciones satisfacibles.</p>`,
exercise:{prompt:'¿Por qué Dijkstra falla con pesos negativos?',
code:'',answer:'Asume que una vez visitado un nodo, su distancia es mínima. Pesos negativos pueden reducirlo después (Bellman-Ford lo resuelve)'}},

    {id:'11-03',title:'DP Avanzado — Knapsack, LCS, Edit Distance, DP en árbol',
content:`<h1>🧠 DP Avanzado: patrones para entrevistas duras</h1>
<h3>0/1 Knapsack — el más preguntado</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// dp[i][w] = max valor usando primeros i items con capacidad w</span>
<span class=\"kw\">int</span> knapsack(<span class=\"kw\">int</span>[] pesos, <span class=\"kw\">int</span>[] valores, <span class=\"kw\">int</span> W) {
    <span class=\"kw\">int</span> n = pesos.length;
    <span class=\"kw\">int</span>[] dp = <span class=\"kw\">new int</span>[W + <span class=\"num\">1</span>];
    <span class=\"kw\">for</span> (<span class=\"kw\">int</span> i = <span class=\"num\">0</span>; i < n; i++)
        <span class=\"kw\">for</span> (<span class=\"kw\">int</span> w = W; w >= pesos[i]; w--)
            dp[w] = <span class=\"typ\">Math</span>.max(dp[w], dp[w - pesos[i]] + valores[i]);
    <span class=\"kw\">return</span> dp[W];
}
<span class=\"cm\">// Complejidad: O(nW) — pseudo-polinomial</span>
<span class=\"cm\">// Variantes: unbounded knapsack (for ascendente), subset sum, partition equal</span></pre></div>
<h3>📐 Longest Common Subsequence (LCS)</h3>
<div class=\"code-block\"><pre><span class=\"kw\">int</span> lcs(<span class=\"typ\">String</span> a, <span class=\"typ\">String</span> b) {
    <span class=\"kw\">int</span> m = a.length(), n = b.length();
    <span class=\"kw\">int</span>[] dp = <span class=\"kw\">new int</span>[n + <span class=\"num\">1</span>];
    <span class=\"kw\">for</span> (<span class=\"kw\">int</span> i = <span class=\"num\">1</span>; i <= m; i++) {
        <span class=\"kw\">int</span> prev = <span class=\"num\">0</span>;
        <span class=\"kw\">for</span> (<span class=\"kw\">int</span> j = <span class=\"num\">1</span>; j <= n; j++) {
            <span class=\"kw\">int</span> temp = dp[j];
            <span class=\"kw\">if</span> (a.charAt(i-<span class=\"num\">1</span>) == b.charAt(j-<span class=\"num\">1</span>))
                dp[j] = prev + <span class=\"num\">1</span>;
            <span class=\"kw\">else</span>
                dp[j] = <span class=\"typ\">Math</span>.max(dp[j], dp[j-<span class=\"num\">1</span>]);
            prev = temp;
        }
    }
    <span class=\"kw\">return</span> dp[n];
}
<span class=\"cm\">// Espacio optimizado: O(min(m,n))</span></pre></div>
<h3>🎯 DP en árbol — el patrón menos dominado</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// Tree DP: dfs que retorna info procesando hijos</span>
<span class=\"kw\">int</span>[] dfs(<span class=\"typ\">TreeNode</span> n) {
    <span class=\"kw\">if</span> (n == <span class=\"kw\">null</span>) <span class=\"kw\">return new int</span>{<span class=\"num\">0</span>, <span class=\"num\">0</span>};  <span class=\"cm\">// {robé esta casa, no robé}</span>
    <span class=\"kw\">int</span>[] l = dfs(n.left), r = dfs(n.right);
    <span class=\"kw\">int</span> robar = n.val + l[<span class=\"num\">1</span>] + r[<span class=\"num\">1</span>];
    <span class=\"kw\">int</span> noRobar = <span class=\"typ\">Math</span>.max(l[<span class=\"num\">0</span>], l[<span class=\"num\">1</span>]) + <span class=\"typ\">Math</span>.max(r[<span class=\"num\">0</span>], r[<span class=\"num\">1</span>]);
    <span class=\"kw\">return new int</span>{robar, noRobar};
}
<span class=\"cm\">// House Robber III es el ejemplo clásico</span></pre></div>`,
exercise:{prompt:'¿Qué complejidad tiene 0/1 Knapsack? ¿Por qué no es polinomial?',
code:'',answer:'O(nW) — pseudo-polinomial porque W es el valor numérico (no tamaño de input). Si W=10³, es 1000x más chico que W=10⁹'}},

    {id:'11-04',title:'Sliding Window — variantes y trucos',
content:`<h1>🪟 Sliding Window: el patrón O(n) por excelencia</h1>
<h3>Estructura genérica</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// Ventana dinámica (tamaño variable)</span>
<span class=\"kw\">int</span> left = <span class=\"num\">0</span>;
<span class=\"kw\">for</span> (<span class=\"kw\">int</span> right = <span class=\"num\">0</span>; right < n; right++) {
    agregar(nums[right]);           <span class=\"cm\">// expandir ventana</span>
    <span class=\"kw\">while</span> (condicionInvalida()) {
        quitar(nums[left]);          <span class=\"cm\">// contraer ventana</span>
        left++;
    }
    actualizarResultado();
}</pre></div>
<h3>📐 Variantes clave</h3>
<table class=\"comp-table\"><tr><th>Problema</th><th>Ventana</th><th>Condición</th><th>Ejemplo LeetCode</th></tr>
<tr><td>Máximo subarray suma k</td><td>Fija (k)</td><td>Suma actual</td><td>643</td></tr>
<tr><td>Longest substring sin repetir</td><td>Variable</td><td>Set/Map de caracteres</td><td>3</td></tr>
<tr><td>Mínima ventana con todos caracteres</td><td>Variable</td><td>Frecuencias == target</td><td>76</td></tr>
<tr><td>Máximo en cada ventana</td><td>Fija</td><td>Deque (monotonic queue)</td><td>239</td></tr>
<tr><td>Subarrays con producto menor a k</td><td>Variable</td><td>Producto < k</td><td>713</td></tr>
<tr><td>Fruit Into Baskets</td><td>Variable</td><td>Máximo 2 tipos</td><td>904</td></tr>
</table>
<h3>🎯 Deque — monotonic queue (LeetCode 239)</h3>
<p>Mantienes un deque de índices donde los valores son decrecientes. Así el frente del deque es siempre el máximo de la ventana actual.</p>
<div class=\"code-block\"><pre><span class=\"cm\">// Sliding Window Maximum — O(n)</span>
<span class=\"typ\">Deque</span>&lt;<span class=\"kw\">Integer</span>&gt; dq = <span class=\"kw\">new</span> <span class=\"typ\">ArrayDeque</span>&lt;&gt;();
<span class=\"kw\">for</span> (<span class=\"kw\">int</span> i = <span class=\"num\">0</span>; i < n; i++) {
    <span class=\"kw\">while</span> (!dq.isEmpty() && dq.peekFirst() < i - k + <span class=\"num\">1</span>) dq.pollFirst();
    <span class=\"kw\">while</span> (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
    dq.offerLast(i);
    <span class=\"kw\">if</span> (i >= k - <span class=\"num\">1</span>) res[i - k + <span class=\"num\">1</span>] = nums[dq.peekFirst()];
}</pre></div>`,
exercise:{prompt:'Sliding Window con Deque para máximo en ventana: ¿complejidad?',
code:'',answer:'O(n) — cada elemento se añade y quita del deque una vez (amortizado)'}},

    {id:'11-05',title:'Backtracking profundo — N-Queens, Sudoku, Subsets, Permutaciones',
content:`<h1>🔙 Backtracking: poda y factibilidad</h1>
<h3>Estructura genérica de backtracking</h3>
<div class=\"code-block\"><pre><span class=\"kw\">void</span> backtrack(candidatos, parcial, resultado) {
    <span class=\"kw\">if</span> (esSolucion(parcial)) {
        resultado.add(new ArrayList<>(parcial));
        <span class=\"kw\">return</span>;
    }
    <span class=\"kw\">for</span> (candidato : candidatos) {
        <span class=\"kw\">if</span> (esValido(candidato, parcial)) {
            hacerMovimiento(candidato, parcial);
            backtrack(candidatos, parcial, resultado);
            deshacerMovimiento(candidato, parcial);  <span class=\"cm\">// BACKTRACK</span>
        }
    }
}</pre></div>
<h3>📐 Poda (pruning) — la clave del rendimiento</h3>
<p>Backtracking sin poda es O(n!) o O(2ⁿ). Con poda, el espacio se reduce drásticamente.</p>
<table class=\"comp-table\"><tr><th>Problema</th><th>Poda típica</th><th>Complejidad con poda</th></tr>
<tr><td>N-Queens</td><td>Misma columna, diagonal, anti-diagonal con sets</td><td>O(N!) — pero mucho menor en práctica</td></tr>
<tr><td>Sudoku</td><td>MRV (Minimum Remaining Values), forward checking</td><td>O(9ⁿ) pero resuelve en ms</td></tr>
<tr><td>Subset Sum</td><td>Ordenar + podar si suma actual > target</td><td>O(2ⁿ) → mucho menor</td></tr>
<tr><td>Word Search</td><td>No revisitar, podar si char no coincide</td><td>O(4ᴸ) con L = longitud palabra</td></tr>
</table>
<h3>🎯 N-Queens — clásico absoluto</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// Mantener sets de columnas, diagonales ocupadas</span>
<span class=\"kw\">private boolean</span> resolver(<span class=\"kw\">int</span> fila, <span class=\"typ\">Set</span>&lt;<span class=\"typ\">Integer</span>&gt; cols,
                         <span class=\"typ\">Set</span>&lt;<span class=\"typ\">Integer</span>&gt; diag1,
                         <span class=\"typ\">Set</span>&lt;<span class=\"typ\">Integer</span>&gt; diag2,
                         <span class=\"kw\">int</span> n, <span class=\"typ\">List</span>&lt;<span class=\"typ\">List</span>&lt;<span class=\"typ\">String</span>&gt;&gt; res) {
    <span class=\"kw\">if</span> (fila == n) { ...; <span class=\"kw\">return true</span>; }
    <span class=\"kw\">for</span> (<span class=\"kw\">int</span> col = <span class=\"num\">0</span>; col < n; col++) {
        <span class=\"kw\">if</span> (cols.contains(col) || diag1.contains(fila + col) || diag2.contains(fila - col)) <span class=\"kw\">continue</span>;
        cols.add(col); diag1.add(fila+col); diag2.add(fila-col);
        ponerReina(fila, col);
        <span class=\"kw\">if</span> (resolver(fila+<span class=\"num\">1</span>, cols, diag1, diag2, n, res)) <span class=\"kw\">return true</span>;
        quitarReina(fila, col);
        cols.remove(col); diag1.remove(fila+col); diag2.remove(fila-col);
    }
    <span class=\"kw\">return false</span>;
}</pre></div>`,
exercise:{prompt:'N-Queens: ¿qué estructura usas para detectar diagonales ocupadas en O(1)?',
code:'',answer:'Dos sets: fila+col (diag principal) y fila-col (anti-diagonal). Si están en el set, está ocupada.'}},

    {id:'11-06',title:'Bit Manipulation — trucos con bits',
content:`<h1>🔢 Bit Manipulation: operaciones en O(1)</h1>
<h3>Operaciones fundamentales</h3>
<table class=\"comp-table\"><tr><th>Operación</th><th>Código</th></tr>
<tr><td>Obtener el i-ésimo bit</td><td><code>(x >> i) & 1</code></td></tr>
<tr><td>Poner el i-ésimo bit a 1</td><td><code>x | (1 << i)</code></td></tr>
<tr><td>Limpiar el i-ésimo bit a 0</td><td><code>x & ~(1 << i)</code></td></tr>
<tr><td>Toggle el i-ésimo bit</td><td><code>x ^ (1 << i)</code></td></tr>
<tr><td>Eliminar el bit menos significativo</td><td><code>x & (x - 1)</code></td></tr>
<tr><td>Aislar el bit menos significativo</td><td><code>x & -x</code></td></tr>
</table>
<h3>📐 Problemas clásicos de bits</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// Contar bits en 1 (population count / Hamming weight)</span>
<span class=\"kw\">int</span> contarBits(<span class=\"kw\">int</span> x) {
    <span class=\"kw\">int</span> count = <span class=\"num\">0</span>;
    <span class=\"kw\">while</span> (x != <span class=\"num\">0</span>) { x &= (x - <span class=\"num\">1</span>); count++; }
    <span class=\"kw\">return</span> count;
}

<span class=\"cm\">// Potencia de 2?</span>
<span class=\"kw\">boolean</span> esPotenciaDos(<span class=\"kw\">int</span> n) { <span class=\"kw\">return</span> n > <span class=\"num\">0</span> && (n & (n - <span class=\"num\">1</span>)) == <span class=\"num\">0</span>; }

<span class=\"cm\">// Suma sin operadores aritméticos</span>
<span class=\"kw\">int</span> suma(<span class=\"kw\">int</span> a, <span class=\"kw\">int</span> b) {
    <span class=\"kw\">while</span> (b != <span class=\"num\">0</span>) {
        <span class=\"kw\">int</span> carry = a & b;
        a ^= b;
        b = carry << <span class=\"num\">1</span>;
    }
    <span class=\"kw\">return</span> a;
}

<span class=\"cm\">// Encontrar único número no repetido (XOR todos)</span>
<span class=\"kw\">int</span> unico = <span class=\"num\">0</span>;
<span class=\"kw\">for</span> (<span class=\"kw\">int</span> n : nums) unico ^= n;</pre></div>
<h3>🎯 DP con mascara de bits (Bitmask DP)</h3>
<p>Cuando el estado se puede representar como un conjunto de bits. Ej: Traveling Salesman Problem (TSP) en O(n²2ⁿ), Partition Equal Subset Sum.</p>
<div class=\"code-block\"><pre><span class=\"cm\">// TSP: dp[mask][v] = mínimo costo para visitar conjunto mask terminando en v</span>
<span class=\"kw\">int</span>[][] dp = <span class=\"kw\">new int</span>[<span class=\"num\">1</span> << n][n];
<span class=\"kw\">for</span> (<span class=\"kw\">int</span> mask = <span class=\"num\">1</span>; mask < (<span class=\"num\">1</span> << n); mask++) {
    <span class=\"kw\">for</span> (<span class=\"kw\">int</span> v = <span class=\"num\">0</span>; v < n; v++) {
        <span class=\"kw\">if</span> ((mask & (<span class=\"num\">1</span> << v)) == <span class=\"num\">0</span>) <span class=\"kw\">continue</span>;
        <span class=\"kw\">for</span> (<span class=\"kw\">int</span> u = <span class=\"num\">0</span>; u < n; u++)
            dp[mask][v] = min(dp[mask][v], dp[mask ^ (<span class=\"num\">1</span> << v)][u] + dist[u][v]);
    }
}</pre></div>`,
exercise:{prompt:'¿Qué hace x & (x - 1)? Da un ejemplo.',
code:'// x = 12 (1100)',answer:'Elimina el bit menos significativo. 12 & 11 = 1100 & 1011 = 1000 = 8'}},

    {id:'11-07',title:'Heap, PriorityQueue, Median Finding',
content:`<h1>📊 Heap: el rey de los problemas de orden parcial</h1>
<h3>Heap binario — implementación con array</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// Para un nodo en índice i:</span>
<span class=\"cm\">// Hijo izquierdo: 2*i + 1</span>
<span class=\"cm\">// Hijo derecho: 2*i + 2</span>
<span class=\"cm\">// Padre: (i - 1) / 2</span>

<span class=\"cm\">// siftUp (insert): O(log n)</span>
<span class=\"cm\">// siftDown (poll): O(log n)</span>
<span class=\"cm\">// heapify (build): O(n) — Floyd's algorithm</span></pre></div>
<h3>📐 Problemas clásicos con heaps</h3>
<table class=\"comp-table\"><tr><th>Problema</th><th>Heap usado</th><th>Complejidad</th></tr>
<tr><td>Top K frecuentes</td><td>Min-heap de tamaño k</td><td>O(n log k)</td></tr>
<tr><td>Merge K sorted lists</td><td>Min-heap con (valor, listaIdx)</td><td>O(n log k)</td></tr>
<tr><td>Mediana en stream</td><td>2 heaps: max + min</td><td>O(log n) por inserción</td></tr>
<tr><td>K closest points</td><td>Max-heap de tamaño k</td><td>O(n log k)</td></tr>
<tr><td>Task scheduler</td><td>Max-heap (frecuencia) + cola de espera</td><td>O(n log n)</td></tr>
</table>
<h3>🎯 Mediana en stream de datos — Two Heaps</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// left = max-heap (elementos menores), right = min-heap (elementos mayores)</span>
<span class=\"typ\">PriorityQueue</span>&lt;<span class=\"typ\">Integer</span>&gt; left = <span class=\"kw\">new</span> <span class=\"typ\">PriorityQueue</span>&lt;&gt;((a,b)->b-a);  <span class=\"cm\">// max-heap</span>
<span class=\"typ\">PriorityQueue</span>&lt;<span class=\"typ\">Integer</span>&gt; right = <span class=\"kw\">new</span> <span class=\"typ\">PriorityQueue</span>&lt;&gt;();       <span class=\"cm\">// min-heap</span>

<span class=\"kw\">void</span> addNum(<span class=\"kw\">int</span> num) {
    left.offer(num);
    right.offer(left.poll());
    <span class=\"kw\">if</span> (left.size() < right.size()) left.offer(right.poll());
}

<span class=\"kw\">double</span> findMedian() {
    <span class=\"kw\">return</span> left.size() > right.size() ? left.peek() 
           : (left.peek() + right.peek()) / <span class=\"num\">2.0</span>;
}</pre></div>`,
exercise:{prompt:'Mediana en stream: ¿por qué usar un max-heap y un min-heap?',
code:'',answer:'Para mantener los elementos divididos en dos mitades. Max-heap da el máximo de la mitad inferior, min-heap da el mínimo de la superior. O(1) para mediana.'}},

    {id:'11-08',title:'Greedy — intervalos, scheduling, Huffman',
content:`<h1>💰 Greedy: lo óptimo local → global</h1>
<h3>Cuándo funciona greedy</h3>
<p>Dos propiedades: <strong>subestructura óptima</strong> (solución global contiene soluciones óptimas locales) y <strong>elección greedy</strong> (lo mejor ahora lleva a lo mejor después).</p>
<h3>📐 Problemas greedy clásicos</h3>
<table class=\"comp-table\"><tr><th>Problema</th><th>Estrategia</th><th>Complejidad</th></tr>
<tr><td>Activity Selection</td><td>Elegir la que termina más temprano</td><td>O(n log n)</td></tr>
<tr><td>Non-overlapping intervals</td><td>Ordenar por fin, contar solapados</td><td>O(n log n)</td></tr>
<tr><td>Minimum arrows to burst balloons</td><td>Ordenar por fin, disparar cuando cambia</td><td>O(n log n)</td></tr>
<tr><td>Jump Game II</td><td>BFS en array, farthest reachable</td><td>O(n)</td></tr>
<tr><td>Gas Station</td><td>Si total >= 0, empezar donde deficit se acumula</td><td>O(n)</td></tr>
<tr><td>Huffman Coding</td><td>Min-heap, fusionar 2 más pequeños</td><td>O(n log n)</td></tr>
<tr><td>Partition Labels</td><td>Última posición, extender ventana</td><td>O(n)</td></tr>
</table>
<h3>🎯 Jump Game II — BFS optimizado</h3>
<div class=\"code-block\"><pre><span class=\"kw\">int</span> jump(<span class=\"kw\">int</span>[] nums) {
    <span class=\"kw\">int</span> saltos = <span class=\"num\">0</span>, curEnd = <span class=\"num\">0</span>, farthest = <span class=\"num\">0</span>;
    <span class=\"kw\">for</span> (<span class=\"kw\">int</span> i = <span class=\"num\">0</span>; i < nums.length - <span class=\"num\">1</span>; i++) {
        farthest = <span class=\"typ\">Math</span>.max(farthest, i + nums[i]);
        <span class=\"kw\">if</span> (i == curEnd) {
            saltos++;
            curEnd = farthest;
        }
    }
    <span class=\"kw\">return</span> saltos;
}
<span class=\"cm\">// BFS en array unidimensional — O(n)</span></pre></div>`,
exercise:{prompt:'Activity Selection: ¿por qué elegir la que termina más temprano es óptimo?',
code:'',answer:'Deja el máximo tiempo posible para las siguientes. Prueba por intercambio: si no eliges la que termina más temprano, puedes reemplazarla y no empeorar la solución.'}},

    {id:'11-09',title:'LRU Cache, LFU Cache — Design Questions',
content:`<h1>💾 Diseño de Caché: LRU y LFU</h1>
<h3>LRU Cache — Least Recently Used (O(1) ambas operaciones)</h3>
<p>HashMap + Doubly LinkedList. HashMap da O(1) para get. LinkedList mantiene orden de uso.</p>
<div class=\"code-block\"><pre><span class=\"kw\">class</span> <span class=\"typ\">LRUCache</span> {
    <span class=\"kw\">class</span> <span class=\"typ\">Node</span> { <span class=\"kw\">int</span> key, val; <span class=\"typ\">Node</span> prev, next; }
    <span class=\"kw\">private final</span> <span class=\"typ\">Map</span>&lt;<span class=\"typ\">Integer</span>, <span class=\"typ\">Node</span>&gt; map = <span class=\"kw\">new</span> <span class=\"typ\">HashMap</span>&lt;&gt;();
    <span class=\"kw\">private final</span> <span class=\"typ\">Node</span> head = <span class=\"kw\">new</span> <span class=\"typ\">Node</span>(), tail = <span class=\"kw\">new</span> <span class=\"typ\">Node</span>();
    <span class=\"kw\">private final int</span> capacity;
    
    <span class=\"kw\">public</span> <span class=\"typ\">LRUCache</span>(<span class=\"kw\">int</span> cap) {
        <span class=\"kw\">this</span>.capacity = cap;
        head.next = tail; tail.prev = head;
    }
    
    <span class=\"kw\">public int</span> get(<span class=\"kw\">int</span> key) {
        <span class=\"kw\">if</span> (!map.containsKey(key)) <span class=\"kw\">return</span> -<span class=\"num\">1</span>;
        <span class=\"typ\">Node</span> n = map.get(key);
        remove(n);
        addFirst(n);
        <span class=\"kw\">return</span> n.val;
    }
    
    <span class=\"kw\">public void</span> put(<span class=\"kw\">int</span> key, <span class=\"kw\">int</span> val) {
        <span class=\"kw\">if</span> (map.containsKey(key)) remove(map.get(key));
        <span class=\"kw\">if</span> (map.size() == capacity) remove(tail.prev);
        <span class=\"typ\">Node</span> n = <span class=\"kw\">new</span> <span class=\"typ\">Node</span>(key, val);
        map.put(key, n);
        addFirst(n);
    }
    
    <span class=\"kw\">private void</span> remove(<span class=\"typ\">Node</span> n) { n.prev.next = n.next; n.next.prev = n.prev; map.remove(n.key); }
    <span class=\"kw\">private void</span> addFirst(<span class=\"typ\">Node</span> n) { n.next = head.next; n.prev = head; head.next.prev = n; head.next = n; }
}</pre></div>
<h3>📐 LFU Cache — más complejo (LeetCode 460)</h3>
<p>HashMap<key, Node> + HashMap<freq, LinkedHashSet<key>> + minFreq tracking. Cada get/put puede cambiar la frecuencia del nodo.</p>
<p>Estrategia: mantener el mínimo de frecuencia actual. Cuando se alcanza capacidad, eliminar el nodo LRU dentro de la frecuencia mínima.</p>`,
exercise:{prompt:'LFU Cache: cuando hay empate de frecuencia, ¿qué elemento se elimina?',
code:'',answer:'El LRU (Least Recently Used) dentro de esa frecuencia — LinkedHashSet mantiene orden de inserción y el primero es el más viejo'}},

    {id:'11-10',title:'Monotonic Stack — Next Greater, Trapping Rain Water',
content:`<h1>📈 Monotonic Stack: O(n) donde pensarías O(n²)</h1>
<h3>Next Greater Element — el patrón base</h3>
<div class=\"code-block\"><pre><span class=\"cm\">// Para cada elemento, el siguiente mayor a su derecha</span>
<span class=\"kw\">int</span>[] nextGreater(<span class=\"kw\">int</span>[] nums) {
    <span class=\"kw\">int</span> n = nums.length;
    <span class=\"kw\">int</span>[] res = <span class=\"kw\">new int</span>[n];
    <span class=\"typ\">Arrays</span>.fill(res, -<span class=\"num\">1</span>);
    <span class=\"typ\">Deque</span>&lt;<span class=\"typ\">Integer</span>&gt; stack = <span class=\"kw\">new</span> <span class=\"typ\">ArrayDeque</span>&lt;&gt;();  <span class=\"cm\">// guarda índices</span>
    <span class=\"kw\">for</span> (<span class=\"kw\">int</span> i = <span class=\"num\">0</span>; i < n; i++) {
        <span class=\"kw\">while</span> (!stack.isEmpty() && nums[stack.peek()] < nums[i])
            res[stack.pop()] = nums[i];
        stack.push(i);
    }
    <span class=\"kw\">return</span> res;
}
<span class=\"cm\">// Monotonic stack decreciente (valores decrecientes en stack)</span>
<span class=\"cm\">// Cada elemento se añade y quita una vez → O(n)</span></pre></div>
<h3>📐 Problemas que usan monotonic stack</h3>
<table class=\"comp-table\"><tr><th>Problema</th><th>Stack</th><th>LeetCode</th></tr>
<tr><td>Next Greater Element</td><td>Decreciente</td><td>496</td></tr>
<tr><td>Daily Temperatures</td><td>Decreciente</td><td>739</td></tr>
<tr><td>Largest Rectangle in Histogram</td><td>Creciente</td><td>84</td></tr>
<tr><td>Maximal Rectangle</td><td>Histogram en cada fila</td><td>85</td></tr>
<tr><td>Trapping Rain Water</td><td>Decreciente (o Two Pointers)</td><td>42</td></tr>
<tr><td>Remove Duplicate Letters</td><td>Decreciente con count</td><td>316</td></tr>
</table>
<h3>🎯 Trapping Rain Water — Two Pointers (O(n), O(1))</h3>
<div class=\"code-block\"><pre><span class=\"kw\">int</span> trap(<span class=\"kw\">int</span>[] altura) {
    <span class=\"kw\">int</span> left = <span class=\"num\">0</span>, right = altura.length - <span class=\"num\">1</span>;
    <span class=\"kw\">int</span> maxL = <span class=\"num\">0</span>, maxR = <span class=\"num\">0</span>, agua = <span class=\"num\">0</span>;
    <span class=\"kw\">while</span> (left < right) {
        <span class=\"kw\">if</span> (altura[left] < altura[right]) {
            <span class=\"kw\">if</span> (altura[left] >= maxL) maxL = altura[left];
            <span class=\"kw\">else</span> agua += maxL - altura[left];
            left++;
        } <span class=\"kw\">else</span> {
            <span class=\"kw\">if</span> (altura[right] >= maxR) maxR = altura[right];
            <span class=\"kw\">else</span> agua += maxR - altura[right];
            right--;
        }
    }
    <span class=\"kw\">return</span> agua;
}</pre></div>`,
exercise:{prompt:'Trapping Rain Water: ¿por qué funciona Two Pointers?',
code:'',answer:'En cada punto, el agua está determinada por el mínimo entre el máximo izquierdo y derecho. Movemos el puntero del lado más bajo porque ese es el limitante actual.'}}
  ]
});
})();
