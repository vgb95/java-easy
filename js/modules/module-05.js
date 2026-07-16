(() => {
MODULES.push({
  id: 5, icon: '🏆', title: 'LeetCode Patterns',
  desc: 'Two Pointers, Sliding Window, BFS/DFS, DP, Backtracking, Binary Search, Graph, Greedy, Trie, Union-Find',
  lessons: [
    {id:'5-01',title:'Two Pointers y Sliding Window',
content:`<h1>🏆 Two Pointers</h1>
<p>Dos índices recorriendo el array desde extremos opuestos (o distinta velocidad).</p>
<div class="code-block"><pre><span class="cm">// Two Sum (sorted array) — O(n) tiempo, O(1) espacio</span>
<span class="kw">int</span>[] twoSum(<span class="kw">int</span>[] nums, <span class="kw">int</span> target) {
    <span class="kw">int</span> i = <span class="num">0</span>, j = nums.length - <span class="num">1</span>;
    <span class="kw">while</span> (i < j) {
        <span class="kw">int</span> s = nums[i] + nums[j];
        <span class="kw">if</span> (s == target) <span class="kw">return new int</span>[]{i, j};
        <span class="kw">if</span> (s < target) i++; <span class="kw">else</span> j--;
    }
    <span class="kw">return null</span>;
}</pre></div>
<h1>🪟 Sliding Window</h1>
<p>Ventana que se desliza manteniendo una propiedad (máximo, mínimo, suma en rango).</p>
<div class="code-block"><pre><span class="cm">// Maximum Sum Subarray of Size K —O(n)</span>
<span class="kw">int</span> maxSum(<span class="kw">int</span>[] arr, <span class="kw">int</span> k) {
    <span class="kw">int</span> suma = <span class="num">0</span>, max = <span class="num">0</span>;
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < arr.length; i++) {
        suma += arr[i];
        <span class="kw">if</span> (i >= k - <span class="num">1</span>) {
            max = <span class="typ">Math</span>.max(max, suma);
            suma -= arr[i - (k - <span class="num">1</span>)];  <span class="cm">// saca el que se va</span>
        }
    }
    <span class="kw">return</span> max;
}</pre></div>
<h3>💡 Complejidad amortizada: O(n)</h3>
<p>Cada elemento se añade una vez y se quita una vez. 2n operaciones = O(n).</p>`,
exercise:{prompt:'¿Qué imprime? (Two Pointers)',
code:'public class Main {\\n    static int[] twoSum(int[] nums, int t) {\\n        int i=0, j=nums.length-1;\\n        while(i<j) {\\n            int s=nums[i]+nums[j];\\n            if(s==t) return new int[]{i,j};\\n            if(s<t) i++; else j--;\\n        }\\n        return null;\\n    }\\n    public static void main(String[] args) {\\n        int[] r = twoSum(new int[]{2,7,11,15}, 9);\\n        System.out.println(r[0] + "," + r[1]);\\n    }\\n}',answer:'0,1'}},

    {id:'5-02',title:'BFS, DFS, y Tree traversals',
content:`<h1>🌳 BFS, DFS y recorridos de árboles</h1>
<h3>BFS (Queue) — nivel por nivel</h3>
<div class="code-block"><pre><span class="kw">void</span> bfs(<span class="typ">TreeNode</span> root) {
    <span class="typ">Queue</span>&lt;<span class="typ">TreeNode</span>&gt; q = <span class="kw">new</span> <span class="typ">LinkedList</span>&lt;&gt;();
    q.offer(root);
    <span class="kw">while</span> (!q.isEmpty()) {
        <span class="typ">TreeNode</span> n = q.poll();
        <span class="typ">System</span>.out.print(n.val + <span class="str">" "</span>);
        <span class="kw">if</span> (n.left != <span class="kw">null</span>) q.offer(n.left);
        <span class="kw">if</span> (n.right != <span class="kw">null</span>) q.offer(n.right);
    }
}</pre></div>
<h3>DFS (Stack/Recursión) — tres órdenes</h3>
<div class="code-block"><pre><span class="cm">// In-order (izq → raíz → der)</span>
<span class="kw">void</span> inOrder(<span class="typ">TreeNode</span> n) {
    <span class="kw">if</span> (n == <span class="kw">null</span>) <span class="kw">return</span>;
    inOrder(n.left);
    <span class="typ">System</span>.out.print(n.val + <span class="str">" "</span>);
    inOrder(n.right);
}

<span class="cm">// Pre-order y Post-order: cambia el orden de las 3 líneas</span></pre></div>
<h3>💡 Matriz de complejidad</h3>
<table class="comp-table"><tr><th></th><th>BFS</th><th>DFS recursivo</th><th>DFS iterativo</th></tr>
<tr><td>Memoria</td><td>O(w) — ancho del árbol</td><td>O(h) — altura, implícito en pila</td><td>O(h) — pila explícita</td></tr>
<tr><td>Encuentra camino corto</td><td>✅ Sí (no ponderado)</td><td>❌ No garantiza</td><td>❌ No garantiza</td></tr>
<tr><td>Detecta ciclos</td><td>Sí</td><td>Sí</td><td>Sí</td></tr>
</table>`,
exercise:{prompt:'¿Qué imprime? (BFS/DFS en árbol [1→2,3])',
code:'import java.util.*;\\nclass N { int v; N l, r; N(int x){v=x;} }\\npublic class Main {\\n    public static void main(String[] args) {\\n        N r = new N(1); r.l = new N(2); r.r = new N(3);\\n        r.l.l = new N(4); r.l.r = new N(5);\\n        Queue<N> q = new LinkedList<>(); q.offer(r);\\n        while(!q.isEmpty()) {\\n            N n = q.poll(); System.out.print(n.v);\\n            if(n.l!=null) q.offer(n.l);\\n            if(n.r!=null) q.offer(n.r);\\n        }\\n    }\\n}',answer:'12345'}},

    {id:'5-03',title:'Dynamic Programming — de recursivo a tabular',
content:`<h1>🧠 Programación Dinámica: divide y vencerás con caché</h1>
<h3>Patrón: recursión + memoización → iterativo tabular</h3>
<div class="code-block"><pre><span class="cm">// 1. Recursivo simple: O(2^n)</span>
<span class="kw">int</span> fibR(<span class="kw">int</span> n) { <span class="kw">return</span> n <= <span class="num">1</span> ? n : fibR(n-<span class="num">1</span>) + fibR(n-<span class="num">2</span>); }

<span class="cm">// 2. Top-down con memo: O(n)</span>
<span class="kw">int</span> fibM(<span class="kw">int</span> n, <span class="kw">int</span>[] memo) {
    <span class="kw">if</span> (n <= <span class="num">1</span>) <span class="kw">return</span> n;
    <span class="kw">if</span> (memo[n] != <span class="num">0</span>) <span class="kw">return</span> memo[n];
    <span class="kw">return</span> memo[n] = fibM(n-<span class="num">1</span>, memo) + fibM(n-<span class="num">2</span>, memo);
}

<span class="cm">// 3. Bottom-up tabular: O(n), O(1) space</span>
<span class="kw">int</span> fib(<span class="kw">int</span> n) {
    <span class="kw">int</span> a = <span class="num">0</span>, b = <span class="num">1</span>;
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">2</span>; i <= n; i++) { <span class="kw">int</span> t = a + b; a = b; b = t; }
    <span class="kw">return</span> b;
}</pre></div>
<h3>📐 Cuándo usar DP: dos condiciones</h3>
<ol><li><strong>Subestructura óptima</strong>: la solución óptima global contiene soluciones óptimas locales</li>
<li><strong>Subproblemas solapados</strong>: los mismos subproblemas aparecen múltiples veces</li></ol>
<h3>🎯 Patrones comunes de DP</h3>
<ul><li><strong>0/1 Knapsack</strong>: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)</li>
<li><strong>Longest Common Subsequence</strong>: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) o +1 si match</li>
<li><strong>Edit Distance (Levenshtein)</strong>: dp[i][j] = min(insert, delete, replace)</li>
<li><strong>Coin Change</strong>: dp[a] = min(dp[a], dp[a - coin] + 1)</li>
<li><strong>Longest Increasing Subsequence</strong>: O(n log n) con patience sorting + binary search</li></ul>`,
exercise:{prompt:'¿Qué imprime? (DP bottom-up)',
code:'public class Main {\\n    public static void main(String[] args) {\\n        int n=10, a=0, b=1;\\n        for(int i=2;i<=n;i++) { int t=a+b; a=b; b=t; }\\n        System.out.println(b);\\n    }\\n}',answer:'55'}},

    {id:'5-04',title:'Backtracking y Greedy',
content:`<h1>🔙 Backtracking — prueba, retrocede, prueba otra vez</h1>
<p>Patrón: <code>hacer cambio → recursión → deshacer cambio</code>. Típico en permutaciones, combinaciones, N-Reinas.</p>
<div class="code-block"><pre><span class="cm">// Todas las permutaciones de un array — O(n!)</span>
<span class="kw">void</span> permutar(<span class="kw">int</span>[] nums, <span class="typ">List</span>&lt;<span class="typ">List</span>&lt;<span class="typ">Integer</span>&gt;&gt; res, <span class="kw">int</span> start) {
    <span class="kw">if</span> (start == nums.length) {
        res.add(<span class="typ">Arrays</span>.stream(nums).boxed().toList());
        <span class="kw">return</span>;
    }
    <span class="kw">for</span> (<span class="kw">int</span> i = start; i < nums.length; i++) {
        swap(nums, start, i);      <span class="cm">// hacer cambio</span>
        permutar(nums, res, start + <span class="num">1</span>);  <span class="cm">// recursión</span>
        swap(nums, start, i);      <span class="cm">// deshacer cambio (backtrack)</span>
    }
}</pre></div>
<h1>💰 Greedy — elección óptima local → óptima global</h1>
<p>Funciona cuando el problema tiene <strong>propiedad greedy</strong>: elegir lo mejor ahora lleva a la solución global.</p>
<table class="comp-table"><tr><th>Problema</th><th>Estrategia greedy</th><th>Complejidad</th></tr>
<tr><td>Coin Change (monedas canónicas)</td><td>Siempre la moneda más grande posible</td><td>O(n)</td></tr>
<tr><td>Activity Selection</td><td>Elegir la que termina más temprano</td><td>O(n log n)</td></tr>
<tr><td>Huffman Coding</td><td>Fusionar dos de menor frecuencia</td><td>O(n log n)</td></tr>
<tr><td>Dijkstra</td><td>Nodo no visitado con menor distancia</td><td>O((V+E) log V)</td></tr>
</table>`,
exercise:{prompt:'¿Qué permutación genera primero? (Backtracking)',
code:'// Given nums = {1,2,3}, first permutation generated by backtracking with swaps from index 0',answer:'[1,2,3]'}}
  ]
});
})();
