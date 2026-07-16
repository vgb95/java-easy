const MODULES = [
  // ──────────────────────────────────
  // M1: FUNDAMENTOS
  // ──────────────────────────────────
  {
    id: 1, icon: '🌱', title: 'Fundamentos de Java',
    desc: 'Variables, tipos, operadores, control de flujo, arrays, strings y métodos',
    lessons: [
      {
        id: '1-1', title: 'Hola Mundo',
        content: `
<h1>🌱 Tu primer programa en Java</h1>
<p>Java es un lenguaje compilado y tipado estáticamente. Todo programa necesita una <strong>clase</strong> y un método <strong>main</strong>.</p>
<div class="code-block"><div class="code-header"><span>📄 Main.java</span></div><pre><code><span class="kw">public class</span> <span class="typ">Main</span> {
    <span class="kw">public static void</span> main(<span class="typ">String</span>[] args) {
        <span class="typ">System</span>.out.println(<span class="str">"¡Hola Mundo!"</span>);
    }
}</code></pre></div>
<p><code>System.out.println()</code> imprime texto con salto de línea. <code>System.out.print()</code> imprime sin salto.</p>
`,
        exercise: {
          prompt: '¿Qué imprime este código?',
          code: `public class Main {
    public static void main(String[] args) {
        System.out.print("Hola ");
        System.out.println("Mundo");
    }
}`,
          answer: 'Hola Mundo'
        }
      },
      {
        id: '1-2', title: 'Variables y tipos primitivos',
        content: `
<h1>📦 Tipos primitivos</h1>
<p>Java tiene 8 tipos primitivos. Se declaran con <code>tipo nombre = valor;</code></p>
<div class="code-block"><div class="code-header"><span>📄 Tipos.java</span></div><pre><code><span class="kw">int</span> edad = <span class="num">25</span>;
<span class="kw">double</span> precio = <span class="num">19.99</span>;
<span class="kw">boolean</span> activo = <span class="kw">true</span>;
<span class="kw">char</span> inicial = <span class="str">'A'</span>;
<span class="typ">String</span> nombre = <span class="str">"Ana"</span>;  <span class="cm">// String no es primitivo pero tiene literales</span></code></pre></div>
<div class="info-box">💡 Las variables locales deben inicializarse antes de usarse. El compilador no te dejará olvidarlo.</div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        int a = 5;
        int b = 2;
        System.out.println(a / b);
        System.out.println(a / (double) b);
    }
}`,
          answer: '2\n2.5'
        }
      },
      {
        id: '1-3', title: 'Operadores',
        content: `
<h1>🔢 Operadores</h1>
<table class="comp-table"><tr><th>Operador</th><th>Uso</th></tr>
<tr><td><code>+ - * / %</code></td><td>Aritméticos</td></tr>
<tr><td><code>== != < > <= >=</code></td><td>Comparación</td></tr>
<tr><td><code>&& || !</code></td><td>Lógicos</td></tr>
<tr><td><code>= += -= *= /= %=</code></td><td>Asignación</td></tr>
<tr><td><code>++ --</code></td><td>Incremento/decremento</td></tr>
</table>
<div class="warning">⚠️ División entera: <code>5 / 2 = 2</code>. Para decimales: <code>5 / 2.0</code> o <code>(double) 5 / 2</code></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        int x = 10;
        x += 5;
        x *= 2;
        System.out.println(x);
        System.out.println(x % 3);
    }
}`,
          answer: '30\n0'
        }
      },
      {
        id: '1-4', title: 'if / else',
        content: `
<h1>🚦 Condicionales</h1>
<div class="code-block"><div class="code-header"><span>📄 IfElse.java</span></div><pre><code><span class="kw">int</span> nota = <span class="num">85</span>;
<span class="kw">if</span> (nota >= <span class="num">90</span>) {
    <span class="typ">System</span>.out.println(<span class="str">"Sobresaliente"</span>);
} <span class="kw">else if</span> (nota >= <span class="num">70</span>) {
    <span class="typ">System</span>.out.println(<span class="str">"Notable"</span>);
} <span class="kw">else</span> {
    <span class="typ">System</span>.out.println(<span class="str">"Necesitas mejorar"</span>);
}</code></pre></div>
<p>Usa <code>if-else if-else</code> para múltiples caminos. También existe el operador ternario: <code>cond ? valTrue : valFalse</code></p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        int hora = 14;
        if (hora < 12) {
            System.out.println("Buenos días");
        } else if (hora < 18) {
            System.out.println("Buenas tardes");
        } else {
            System.out.println("Buenas noches");
        }
    }
}`,
          answer: 'Buenas tardes'
        }
      },
      {
        id: '1-5', title: 'Bucles',
        content: `
<h1>🔄 Bucles</h1>
<p><strong>for</strong>: cuando sabes cuántas iteraciones</p>
<div class="code-block"><div class="code-header"><span>📄 For.java</span></div><pre><code><span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < <span class="num">3</span>; i++) {
    <span class="typ">System</span>.out.println(<span class="str">"Vuelta "</span> + i);
}</code></pre></div>
<p><strong>while</strong>: cuando repites hasta que se cumpla una condición</p>
<div class="code-block"><div class="code-header"><span>📄 While.java</span></div><pre><code><span class="kw">int</span> cont = <span class="num">0</span>;
<span class="kw">while</span> (cont < <span class="num">3</span>) {
    <span class="typ">System</span>.out.println(cont);
    cont++;
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        int suma = 0;
        for (int i = 1; i <= 5; i++) {
            suma += i;
        }
        System.out.println(suma);
    }
}`,
          answer: '15'
        }
      },
      {
        id: '1-6', title: 'Arrays',
        content: `
<h1>📊 Arrays</h1>
<p>Los arrays tienen tamaño fijo y se accede por índice (empieza en 0).</p>
<div class="code-block"><div class="code-header"><span>📄 Arrays.java</span></div><pre><code><span class="kw">int</span>[] nums = {<span class="num">10</span>, <span class="num">20</span>, <span class="num">30</span>, <span class="num">40</span>};
<span class="typ">System</span>.out.println(nums[<span class="num">0</span>]);            <span class="cm">// 10</span>
<span class="typ">System</span>.out.println(nums.length);        <span class="cm">// 4</span>
<span class="typ">System</span>.out.println(nums[nums.length-<span class="num">1</span>]); <span class="cm">// 40</span></code></pre></div>
<p>Cuidado: acceder a un índice fuera del rango lanza <code>ArrayIndexOutOfBoundsException</code>.</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        int[] arr = {2, 4, 6, 8};
        int r = 0;
        for (int i = 0; i < arr.length; i++) {
            r += arr[i];
        }
        System.out.println(r / arr.length);
    }
}`,
          answer: '5'
        }
      },
      {
        id: '1-7', title: 'Strings',
        content: `
<h1>📝 Strings</h1>
<p>Los String son inmutables. Cada método devuelve un String nuevo.</p>
<table class="comp-table"><tr><th>Método</th><th>Qué hace</th></tr>
<tr><td><code>length()</code></td><td>Longitud</td></tr>
<tr><td><code>charAt(i)</code></td><td>Carácter en i</td></tr>
<tr><td><code>substring(i, j)</code></td><td>Subcadena [i, j)</td></tr>
<tr><td><code>equals(s)</code></td><td>Compara contenido (¡NO uses ==!)</td></tr>
<tr><td><code>toUpperCase()</code></td><td>Mayúsculas</td></tr>
<tr><td><code>trim()</code></td><td>Quita espacios</td></tr>
<tr><td><code>indexOf(s)</code></td><td>Posición de s (-1 si no)</td></tr>
</table>
<div class="warning">⚠️ Compara Strings con <code>.equals()</code>, no con <code>==</code>. <code>==</code> compara referencias.</div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        String s = "  Java es genial  ";
        String t = s.trim().toUpperCase();
        System.out.println(t);
        System.out.println(t.indexOf("GENIAL"));
    }
}`,
          answer: 'JAVA ES GENIAL\n8'
        }
      },
      {
        id: '1-8', title: 'Métodos estáticos',
        content: `
<h1>🧩 Métodos</h1>
<p>Un método agrupa código reutilizable. Los métodos <code>static</code> pertenecen a la clase.</p>
<div class="code-block"><div class="code-header"><span>📄 Metodos.java</span></div><pre><code><span class="kw">static int</span> sumar(<span class="kw">int</span> a, <span class="kw">int</span> b) {
    <span class="kw">return</span> a + b;
}

<span class="kw">static boolean</span> esPar(<span class="kw">int</span> n) {
    <span class="kw">return</span> n % <span class="num">2</span> == <span class="num">0</span>;
}

<span class="cm">// Llamada</span>
<span class="kw">int</span> r = sumar(<span class="num">5</span>, <span class="num">3</span>);       <span class="cm">// r = 8</span>
<span class="kw">boolean</span> p = esPar(<span class="num">4</span>);    <span class="cm">// true</span></code></pre></div>
<p>Estructura: <code>modificador tipoRetorno nombre(parámetros) { cuerpo }</code></p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    static int fib(int n) {
        if (n <= 1) return n;
        return fib(n-1) + fib(n-2);
    }
    public static void main(String[] args) {
        System.out.println(fib(6));
    }
}`,
          answer: '8'
        }
      }
    ]
  },

  // ──────────────────────────────────
  // M2: POO
  // ──────────────────────────────────
  {
    id: 2, icon: '🏗️', title: 'Programación Orientada a Objetos',
    desc: 'Clases, objetos, constructores, encapsulamiento, herencia, interfaces, polimorfismo',
    lessons: [
      {
        id: '2-1', title: 'Clases y objetos',
        content: `
<h1>🏗️ Clases y objetos</h1>
<p>Una <strong>clase</strong> es el molde. Un <strong>objeto</strong> es la instancia.</p>
<div class="code-block"><div class="code-header"><span>📄 Persona.java</span></div><pre><code><span class="kw">class</span> <span class="typ">Persona</span> {
    <span class="typ">String</span> nombre;
    <span class="kw">int</span> edad;

    <span class="kw">void</span> saludar() {
        <span class="typ">System</span>.out.println(<span class="str">"Hola, soy "</span> + nombre);
    }
}

<span class="cm">// Uso</span>
<span class="typ">Persona</span> p = <span class="kw">new</span> <span class="typ">Persona</span>();
p.nombre = <span class="str">"Luis"</span>;
p.edad = <span class="num">30</span>;
p.saludar();</code></pre></div>
<p>La palabra clave <code>new</code> reserva memoria en el <strong>heap</strong> y ejecuta el constructor.</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `class Coche {
    String marca;
    int velocidad;
    void acelerar() { velocidad += 10; }
}
public class Main {
    public static void main(String[] args) {
        Coche c = new Coche();
        c.marca = "Toyota";
        c.acelerar();
        c.acelerar();
        System.out.println(c.marca + ": " + c.velocidad + " km/h");
    }
}`,
          answer: 'Toyota: 20 km/h'
        }
      },
      {
        id: '2-2', title: 'Constructores',
        content: `
<h1>🔧 Constructores</h1>
<p>El constructor inicializa el objeto. Tiene el mismo nombre que la clase y no retorna nada.</p>
<div class="code-block"><div class="code-header"><span>📄 Constructor.java</span></div><pre><code><span class="kw">class</span> <span class="typ">Libro</span> {
    <span class="typ">String</span> titulo;
    <span class="kw">int</span> paginas;

    <span class="cm">// Constructor</span>
    <span class="typ">Libro</span>(<span class="typ">String</span> t, <span class="kw">int</span> p) {
        titulo = t;
        paginas = p;
    }
}

<span class="typ">Libro</span> lib = <span class="kw">new</span> <span class="typ">Libro</span>(<span class="str">"1984"</span>, <span class="num">328</span>);</code></pre></div>
<p>Si no defines ningún constructor, Java pone uno vacío por defecto. Si defines uno, el vacío desaparece.</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `class Rectangulo {
    int ancho, alto;
    Rectangulo(int a, int h) { ancho = a; alto = h; }
    int area() { return ancho * alto; }
}
public class Main {
    public static void main(String[] args) {
        Rectangulo r = new Rectangulo(5, 3);
        System.out.println(r.area());
    }
}`,
          answer: '15'
        }
      },
      {
        id: '2-3', title: 'Encapsulamiento',
        content: `
<h1>🔒 Encapsulamiento</h1>
<p>Los modificadores de acceso controlan quién ve qué:</p>
<table class="comp-table"><tr><th>Modificador</th><th>Clase</th><th>Paquete</th><th>Subclase</th><th>Mundo</th></tr>
<tr><td><code>public</code></td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
<tr><td><code>protected</code></td><td>✓</td><td>✓</td><td>✓</td><td>✗</td></tr>
<tr><td><code>(default)</code></td><td>✓</td><td>✓</td><td>✗</td><td>✗</td></tr>
<tr><td><code>private</code></td><td>✓</td><td>✗</td><td>✗</td><td>✗</td></tr>
</table>
<div class="code-block"><div class="code-header"><span>📄 Cuenta.java</span></div><pre><code><span class="kw">class</span> <span class="typ">Cuenta</span> {
    <span class="kw">private double</span> saldo;  <span class="cm">// solo esta clase accede</span>

    <span class="kw">public void</span> depositar(<span class="kw">double</span> monto) {
        <span class="kw">if</span> (monto > <span class="num">0</span>) saldo += monto;
    }

    <span class="kw">public double</span> getSaldo() {
        <span class="kw">return</span> saldo;
    }
}</code></pre></div>
<p>Convención: atributos <code>private</code>, getters/setters <code>public</code>.</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `class Contador {
    private int valor;
    public void incrementar() { valor++; }
    public int getValor() { return valor; }
}
public class Main {
    public static void main(String[] args) {
        Contador c = new Contador();
        c.incrementar();
        c.incrementar();
        c.incrementar();
        System.out.println(c.getValor());
    }
}`,
          answer: '3'
        }
      },
      {
        id: '2-4', title: 'Herencia',
        content: `
<h1>🧬 Herencia</h1>
<p>Una clase hija <strong>extiende</strong> a la padre, heredando sus atributos y métodos.</p>
<div class="code-block"><div class="code-header"><span>📄 Herencia.java</span></div><pre><code><span class="kw">class</span> <span class="typ">Animal</span> {
    <span class="kw">void</span> sonido() {
        <span class="typ">System</span>.out.println(<span class="str">"..."</span>);
    }
}

<span class="kw">class</span> <span class="typ">Perro</span> <span class="kw">extends</span> <span class="typ">Animal</span> {
    <span class="kw">void</span> sonido() {  <span class="cm">// sobrescribe</span>
        <span class="typ">System</span>.out.println(<span class="str">"Guau"</span>);
    }
}

<span class="typ">Animal</span> a = <span class="kw">new</span> <span class="typ">Perro</span>();
a.sonido();  <span class="cm">// "Guau" — polimorfismo</span></code></pre></div>
<p>Usa <code>super</code> para llamar al método del padre. <code>super()</code> para el constructor del padre.</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `class Vehiculo {
    String tipo = "Vehículo";
    String info() { return tipo; }
}
class Coche extends Vehiculo {
    String tipo = "Coche";
    String info() { return super.info() + " > " + tipo; }
}
public class Main {
    public static void main(String[] args) {
        System.out.println(new Coche().info());
    }
}`,
          answer: 'Vehículo > Coche'
        }
      },
      {
        id: '2-5', title: 'Interfaces',
        content: `
<h1>🔌 Interfaces</h1>
<p>Una interfaz define <strong>qué</strong> hacer, no <strong>cómo</strong>. Las clases implementan interfaces.</p>
<div class="code-block"><div class="code-header"><span>📄 Interfaces.java</span></div><pre><code><span class="kw">interface</span> <span class="typ">Volador</span> {
    <span class="kw">void</span> volar();  <span class="cm">// público y abstracto implícito</span>
}

<span class="kw">class</span> <span class="typ">Pajaro</span> <span class="kw">implements</span> <span class="typ">Volador</span> {
    <span class="kw">public void</span> volar() {
        <span class="typ">System</span>.out.println(<span class="str">"Alas"</span>);
    }
}

<span class="kw">class</span> <span class="typ">Avion</span> <span class="kw">implements</span> <span class="typ">Volador</span> {
    <span class="kw">public void</span> volar() {
        <span class="typ">System</span>.out.println(<span class="str">"Motores"</span>);
    }
}</code></pre></div>
<p>Java no tiene herencia múltiple de clases, pero una clase puede implementar varias interfaces.</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `interface Imprimible {
    void imprimir();
}
class Documento implements Imprimible {
    String texto;
    Documento(String t) { texto = t; }
    public void imprimir() { System.out.println("📄 " + texto); }
}
public class Main {
    public static void main(String[] args) {
        new Documento("Hola").imprimir();
    }
}`,
          answer: '📄 Hola'
        }
      },
      {
        id: '2-6', title: 'Polimorfismo',
        content: `
<h1>🎭 Polimorfismo</h1>
<p>Un objeto puede comportarse como múltiples tipos. El método que se ejecuta se decide en <strong>tiempo de ejecución</strong>.</p>
<div class="code-block"><div class="code-header"><span>📄 Polimorfismo.java</span></div><pre><code><span class="typ">Animal</span>[] animales = {<span class="kw">new</span> <span class="typ">Perro</span>(), <span class="kw">new</span> <span class="typ">Gato</span>()};
<span class="kw">for</span> (<span class="typ">Animal</span> a : animales) {
    a.sonido();  <span class="cm">// cada uno hace su versión</span>
}</code></pre></div>
<p>El polimorfismo funciona con herencia (<code>extends</code>) e interfaces (<code>implements</code>).</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `interface Figura {
    double area();
}
class Circulo implements Figura {
    double r;
    Circulo(double r) { this.r = r; }
    public double area() { return 3.14 * r * r; }
}
class Cuadrado implements Figura {
    double l;
    Cuadrado(double l) { this.l = l; }
    public double area() { return l * l; }
}
public class Main {
    public static void main(String[] args) {
        Figura[] figs = {new Circulo(1), new Cuadrado(2)};
        for (Figura f : figs) System.out.println(f.area());
    }
}`,
          answer: '3.14\n4.0'
        }
      }
    ]
  },

  // ──────────────────────────────────
  // M3: COLECCIONES Y STREAMS
  // ──────────────────────────────────
  {
    id: 3, icon: '📚', title: 'Colecciones y Streams',
    desc: 'List, Set, Map, Stream API, lambdas, Optional',
    lessons: [
      {
        id: '3-1', title: 'ArrayList',
        content: `
<h1>📚 ArrayList</h1>
<p>Lista dinámica que crece sola. <code>ArrayList&lt;Tipo&gt;</code></p>
<div class="code-block"><div class="code-header"><span>📄 ArrayList.java</span></div><pre><code><span class="kw">import</span> <span class="typ">java</span>.util.*;

<span class="typ">ArrayList</span>&lt;<span class="typ">String</span>&gt; nombres = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;();
nombres.add(<span class="str">"Ana"</span>);
nombres.add(<span class="str">"Luis"</span>);
nombres.get(<span class="num">0</span>);         <span class="cm">// "Ana"</span>
nombres.size();          <span class="cm">// 2</span>
nombres.remove(<span class="num">0</span>);
nombres.contains(<span class="str">"Luis"</span>); <span class="cm">// true</span></code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(10); nums.add(20); nums.add(30);
        nums.add(1, 15);
        nums.remove(3);
        System.out.println(nums);
    }
}`,
          answer: '[10, 15, 20]'
        }
      },
      {
        id: '3-2', title: 'HashSet y HashMap',
        content: `
<h1>🗂️ Set y Map</h1>
<p><strong>Set</strong>: no duplicados. <strong>Map</strong>: clave → valor.</p>
<div class="code-block"><div class="code-header"><span>📄 SetMap.java</span></div><pre><code><span class="typ">HashSet</span>&lt;<span class="typ">String</span>&gt; set = <span class="kw">new</span> <span class="typ">HashSet</span>&lt;&gt;();
set.add(<span class="str">"a"</span>); set.add(<span class="str">"b"</span>); set.add(<span class="str">"a"</span>);  <span class="cm">// tamaño 2</span>

<span class="typ">HashMap</span>&lt;<span class="typ">String</span>, <span class="typ">Integer</span>&gt; mapa = <span class="kw">new</span> <span class="typ">HashMap</span>&lt;&gt;();
mapa.put(<span class="str">"Ana"</span>, <span class="num">25</span>);
mapa.put(<span class="str">"Luis"</span>, <span class="num">30</span>);
mapa.get(<span class="str">"Ana"</span>);       <span class="cm">// 25</span>
mapa.containsKey(<span class="str">"Luis"</span>); <span class="cm">// true</span></code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> edades = new HashMap<>();
        edades.put("Ana", 25);
        edades.put("Luis", 30);
        edades.put("Ana", 26);
        System.out.println(edades.get("Ana") + edades.get("Luis"));
    }
}`,
          answer: '56'
        }
      },
      {
        id: '3-3', title: 'Lambdas',
        content: `
<h1>λ Expresiones lambda</h1>
<p>Una lambda es una función anónima: <code>(parámetros) -> expresión</code></p>
<div class="code-block"><div class="code-header"><span>📄 Lambdas.java</span></div><pre><code><span class="typ">ArrayList</span>&lt;<span class="typ">String</span>&gt; nombres = ...;
nombres.forEach(n -> <span class="typ">System</span>.out.println(n));

<span class="cm">// Ordenar</span>
nombres.sort((a, b) -> a.compareTo(b));

<span class="cm">// Filtrar</span>
nombres.removeIf(n -> n.startsWith(<span class="str">"A"</span>));</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        for (int i = 1; i <= 10; i++) nums.add(i);
        nums.removeIf(n -> n % 2 == 0);
        System.out.println(nums);
    }
}`,
          answer: '[1, 3, 5, 7, 9]'
        }
      },
      {
        id: '3-4', title: 'Stream API',
        content: `
<h1>🌊 Stream API</h1>
<p>Operaciones encadenadas sobre colecciones: <code>filter</code> → <code>map</code> → <code>collect</code></p>
<div class="code-block"><div class="code-header"><span>📄 Streams.java</span></div><pre><code><span class="typ">List</span>&lt;<span class="typ">Integer</span>&gt; nums = <span class="typ">Arrays</span>.asList(<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>);
<span class="kw">int</span> sumaPares = nums.stream()
    .filter(n -> n % <span class="num">2</span> == <span class="num">0</span>)
    .mapToInt(n -> n)
    .sum();  <span class="cm">// 6 (2+4)</span>

<span class="typ">List</span>&lt;<span class="typ">String</span>&gt; mayus = nums.stream()
    .map(n -> <span class="str">"N"</span> + n)
    .collect(<span class="typ">Collectors</span>.toList());</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(5, 2, 8, 1, 9);
        List<Integer> r = nums.stream()
            .filter(n -> n > 4)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(r);
    }
}`,
          answer: '[5, 8, 9]'
        }
      },
      {
        id: '3-5', title: 'Optional',
        content: `
<h1>🎯 Optional</h1>
<p>Envuelve un valor que puede ser <code>null</code>. Evita <code>NullPointerException</code>.</p>
<div class="code-block"><div class="code-header"><span>📄 Optional.java</span></div><pre><code><span class="typ">Optional</span>&lt;<span class="typ">String</span>&gt; opt = <span class="typ">Optional</span>.ofNullable(obtenerNombre());
opt.ifPresent(n -> <span class="typ">System</span>.out.println(n));
<span class="typ">String</span> nombre = opt.orElse(<span class="str">"Invitado"</span>);
opt.orElseThrow(() -> <span class="kw">new</span> <span class="typ">RuntimeException</span>(<span class="str">"No hay nombre"</span>));</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
public class Main {
    static Optional<String> buscar(int id) {
        if (id == 1) return Optional.of("Ana");
        return Optional.empty();
    }
    public static void main(String[] args) {
        System.out.println(buscar(1).orElse("Nadie"));
        System.out.println(buscar(2).orElse("Nadie"));
    }
}`,
          answer: 'Ana\nNadie'
        }
      }
    ]
  },

  // ──────────────────────────────────
  // M4: CONCURRENCIA
  // ──────────────────────────────────
  {
    id: 4, icon: '⚡', title: 'Concurrencia',
    desc: 'Threads, sincronización, ExecutorService, CompletableFuture',
    lessons: [
      {
        id: '4-1', title: 'Threads básicos',
        content: `
<h1>⚡ Crear hilos</h1>
<p>Dos formas: extender <code>Thread</code> o implementar <code>Runnable</code>.</p>
<div class="code-block"><div class="code-header"><span>📄 Threads.java</span></div><pre><code><span class="cm">// Con Runnable (más común)</span>
<span class="typ">Runnable</span> tarea = () -> {
    <span class="typ">System</span>.out.println(<span class="str">"Hilo: "</span> + <span class="typ">Thread</span>.currentThread().getName());
};
<span class="kw">new</span> <span class="typ">Thread</span>(tarea).start();

<span class="cm">// Extendiendo Thread</span>
<span class="kw">class</span> <span class="typ">MiHilo</span> <span class="kw">extends</span> <span class="typ">Thread</span> {
    <span class="kw">public void</span> run() { ... }
}</code></pre></div>
<p><code>start()</code> lanza el hilo. <code>run()</code> ejecuta en el mismo hilo.</p>
`,
        exercise: {
          prompt: '¿Qué imprime? (el orden puede variar)',
          code: `public class Main {
    public static void main(String[] args) {
        Runnable t = () -> System.out.print("Hilo ");
        new Thread(t).start();
        System.out.print("Main ");
    }
}`,
          answer: 'Main Hilo '
        }
      },
      {
        id: '4-2', title: 'Sincronización',
        content: `
<h1>🔒 synchronized</h1>
<p>Evita que dos hilos modifiquen el mismo recurso a la vez.</p>
<div class="code-block"><div class="code-header"><span>📄 Sync.java</span></div><pre><code><span class="kw">class</span> <span class="typ">Contador</span> {
    <span class="kw">private int</span> valor = <span class="num">0</span>;

    <span class="kw">public synchronized void</span> incrementar() {
        valor++;  <span class="cm">// sin synchronized, esto no es atómico</span>
    }
}</code></pre></div>
<p>También puedes sincronizar bloques: <code>synchronized(objeto) { ... }</code></p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `class Cont {
    int v = 0;
    synchronized void inc() { v++; }
    int get() { return v; }
}
public class Main {
    public static void main(String[] args) throws Exception {
        Cont c = new Cont();
        Thread t1 = new Thread(() -> { for(int i=0;i<1000;i++) c.inc(); });
        Thread t2 = new Thread(() -> { for(int i=0;i<1000;i++) c.inc(); });
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println(c.get());
    }
}`,
          answer: '2000'
        }
      },
      {
        id: '4-3', title: 'ExecutorService',
        content: `
<h1>🏭 ExecutorService</h1>
<p>Maneja un pool de hilos. Mejor que crear hilos a mano.</p>
<div class="code-block"><div class="code-header"><span>📄 Executor.java</span></div><pre><code><span class="typ">ExecutorService</span> pool = <span class="typ">Executors</span>.newFixedThreadPool(<span class="num">4</span>);

<span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < <span class="num">10</span>; i++) {
    pool.submit(() -> {
        <span class="typ">System</span>.out.println(<span class="typ">Thread</span>.currentThread().getName());
    });
}

pool.shutdown();  <span class="cm">// no acepta más tareas</span>
pool.awaitTermination(<span class="num">5</span>, <span class="typ">TimeUnit</span>.SECONDS);</code></pre></div>
<p>Métodos útiles: <code>newCachedThreadPool()</code>, <code>newSingleThreadExecutor()</code>, <code>newScheduledThreadPool()</code></p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.concurrent.*;
public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        Future<Integer> f = pool.submit(() -> {
            Thread.sleep(100);
            return 42;
        });
        System.out.println(f.get());
        pool.shutdown();
    }
}`,
          answer: '42'
        }
      },
      {
        id: '4-4', title: 'CompletableFuture',
        content: `
<h1>🔮 CompletableFuture</h1>
<p>Programación asíncrona con <em>callbacks</em>. Encadena operaciones sin bloquear.</p>
<div class="code-block"><div class="code-header"><span>📄 Completable.java</span></div><pre><code><span class="typ">CompletableFuture</span>
    .supplyAsync(() -> tareaLenta())
    .thenApply(r -> r * <span class="num">2</span>)
    .thenAccept(r -> <span class="typ">System</span>.out.println(r))
    .exceptionally(e -> { <span class="typ">System</span>.err.println(e); <span class="kw">return null</span>; });

<span class="cm">// Esperar sin bloquear el hilo principal</span>
<span class="typ">CompletableFuture</span>.allOf(f1, f2, f3).join();</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.concurrent.*;
public class Main {
    public static void main(String[] args) {
        String r = CompletableFuture
            .supplyAsync(() -> "Hola")
            .thenApply(s -> s + " Mundo")
            .join();
        System.out.println(r);
    }
}`,
          answer: 'Hola Mundo'
        }
      }
    ]
  },

  // ──────────────────────────────────
  // M5: LEETCODE PATTERNS
  // ──────────────────────────────────
  {
    id: 5, icon: '🏆', title: 'LeetCode Patterns',
    desc: 'Two Pointers, Sliding Window, BFS/DFS, Dynamic Programming',
    lessons: [
      {
        id: '5-1', title: 'Two Pointers',
        content: `
<h1>🏆 Two Pointers</h1>
<p>Usa dos índices para recorrer un array desde ambos extremos o a distintas velocidades.</p>
<div class="code-block"><div class="code-header"><span>📄 TwoSumSorted.java</span></div><pre><code><span class="cm">// Dado un array ordenado, encontrar dos números que sumen target</span>
<span class="kw">int</span>[] twoSum(<span class="kw">int</span>[] nums, <span class="kw">int</span> target) {
    <span class="kw">int</span> i = <span class="num">0</span>, j = nums.length - <span class="num">1</span>;
    <span class="kw">while</span> (i < j) {
        <span class="kw">int</span> suma = nums[i] + nums[j];
        <span class="kw">if</span> (suma == target) <span class="kw">return new int</span>[]{i, j};
        <span class="kw">if</span> (suma < target) i++;
        <span class="kw">else</span> j--;
    }
    <span class="kw">return null</span>;
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    static int[] twoSum(int[] nums, int target) {
        int i = 0, j = nums.length - 1;
        while (i < j) {
            int s = nums[i] + nums[j];
            if (s == target) return new int[]{i, j};
            if (s < target) i++; else j--;
        }
        return null;
    }
    public static void main(String[] args) {
        int[] r = twoSum(new int[]{1, 3, 5, 7, 9}, 10);
        System.out.println(r[0] + ", " + r[1]);
    }
}`,
          answer: '1, 3'
        }
      },
      {
        id: '5-2', title: 'Sliding Window',
        content: `
<h1>🪟 Sliding Window</h1>
<p>Ventana que se desliza sobre el array para encontrar subarrays óptimos.</p>
<div class="code-block"><div class="code-header"><span>📄 MaxSumSubarray.java</span></div><pre><code><span class="cm">// Máxima suma de subarray de tamaño k</span>
<span class="kw">int</span> maxSum(<span class="kw">int</span>[] arr, <span class="kw">int</span> k) {
    <span class="kw">int</span> suma = <span class="num">0</span>, max = <span class="num">0</span>;
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < arr.length; i++) {
        suma += arr[i];
        <span class="kw">if</span> (i >= k - <span class="num">1</span>) {
            max = <span class="typ">Math</span>.max(max, suma);
            suma -= arr[i - (k - <span class="num">1</span>)];
        }
    }
    <span class="kw">return</span> max;
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    static int maxSum(int[] arr, int k) {
        int suma = 0, max = 0;
        for (int i = 0; i < arr.length; i++) {
            suma += arr[i];
            if (i >= k-1) {
                max = Math.max(max, suma);
                suma -= arr[i-(k-1)];
            }
        }
        return max;
    }
    public static void main(String[] args) {
        System.out.println(maxSum(new int[]{2, 1, 5, 1, 3, 2}, 3));
    }
}`,
          answer: '9'
        }
      },
      {
        id: '5-3', title: 'BFS / DFS',
        content: `
<h1>🌳 BFS y DFS</h1>
<p>Recorridos de grafos/árboles. BFS usa cola, DFS usa pila (o recursión).</p>
<div class="code-block"><div class="code-header"><span>📄 BFS.java</span></div><pre><code><span class="cm">// BFS en árbol binario</span>
<span class="kw">void</span> bfs(<span class="typ">TreeNode</span> raiz) {
    <span class="typ">Queue</span>&lt;<span class="typ">TreeNode</span>&gt; q = <span class="kw">new</span> <span class="typ">LinkedList</span>&lt;&gt;();
    q.offer(raiz);
    <span class="kw">while</span> (!q.isEmpty()) {
        <span class="typ">TreeNode</span> n = q.poll();
        <span class="typ">System</span>.out.println(n.val);
        <span class="kw">if</span> (n.left != <span class="kw">null</span>) q.offer(n.left);
        <span class="kw">if</span> (n.right != <span class="kw">null</span>) q.offer(n.right);
    }
}

<span class="cm">// DFS recursivo (in-order)</span>
<span class="kw">void</span> dfs(<span class="typ">TreeNode</span> n) {
    <span class="kw">if</span> (n == <span class="kw">null</span>) <span class="kw">return</span>;
    dfs(n.left);
    <span class="typ">System</span>.out.println(n.val);
    dfs(n.right);
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime BFS sobre [1 → 2,3 → 4,5,6,7]?',
          code: `import java.util.*;
class TreeNode { int val; TreeNode left, right;
    TreeNode(int v) { val = v; }
}
public class Main {
    public static void main(String[] args) {
        TreeNode r = new TreeNode(1);
        r.left = new TreeNode(2); r.right = new TreeNode(3);
        r.left.left = new TreeNode(4); r.left.right = new TreeNode(5);
        r.right.left = new TreeNode(6); r.right.right = new TreeNode(7);
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(r);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            System.out.print(n.val + " ");
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
    }
}`,
          answer: '1 2 3 4 5 6 7'
        }
      },
      {
        id: '5-4', title: 'Dynamic Programming',
        content: `
<h1>🧠 Programación Dinámica</h1>
<p>Divide el problema en subproblemas y guarda resultados para no repetir.</p>
<div class="code-block"><div class="code-header"><span>📄 Fibonacci DP.java</span></div><pre><code><span class="cm">// Fibonacci con DP: O(n) en vez de O(2^n)</span>
<span class="kw">int</span> fib(<span class="kw">int</span> n) {
    <span class="kw">if</span> (n <= <span class="num">1</span>) <span class="kw">return</span> n;
    <span class="kw">int</span>[] dp = <span class="kw">new int</span>[n + <span class="num">1</span>];
    dp[<span class="num">0</span>] = <span class="num">0</span>; dp[<span class="num">1</span>] = <span class="num">1</span>;
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">2</span>; i <= n; i++)
        dp[i] = dp[i-<span class="num">1</span>] + dp[i-<span class="num">2</span>];
    <span class="kw">return</span> dp[n];
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        int n = 10;
        int[] dp = new int[n+1];
        dp[0] = 0; dp[1] = 1;
        for (int i = 2; i <= n; i++)
            dp[i] = dp[i-1] + dp[i-2];
        System.out.println(dp[n]);
    }
}`,
          answer: '55'
        }
      }
    ]
  },

  // ──────────────────────────────────
  // M6: PROYECTO INTEGRADOR
  // ──────────────────────────────────
  {
    id: 6, icon: '🚀', title: 'Proyecto Integrador: CineBox',
    desc: 'Construye una mini app estilo IMDb desde cero',
    lessons: [
      {
        id: '6-1', title: 'Modelo de datos',
        content: `
<h1>🚀 CineBox — Modelo</h1>
<p>Vamos a construir <strong>CineBox</strong>, un sistema para gestionar películas, actores y reseñas.</p>
<div class="code-block"><div class="code-header"><span>📄 Modelo.java</span></div><pre><code><span class="kw">class</span> <span class="typ">Pelicula</span> {
    <span class="kw">int</span> id;
    <span class="typ">String</span> titulo;
    <span class="kw">int</span> anio;
    <span class="typ">String</span> genero;
    <span class="kw">double</span> rating;
}

<span class="kw">class</span> <span class="typ">Actor</span> {
    <span class="kw">int</span> id;
    <span class="typ">String</span> nombre;
    <span class="typ">ArrayList</span>&lt;<span class="typ">Pelicula</span>&gt; peliculas;
}

<span class="kw">class</span> <span class="typ">Reseña</span> {
    <span class="typ">String</span> usuario;
    <span class="kw">int</span> peliculaId;
    <span class="kw">int</span> puntuacion;  <span class="cm">// 1-10</span>
    <span class="typ">String</span> comentario;
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
class Pelicula {
    String titulo; double rating;
    Pelicula(String t, double r) { titulo = t; rating = r; }
    String info() { return titulo + " (" + rating + ")"; }
}
public class Main {
    public static void main(String[] args) {
        ArrayList<Pelicula> pelis = new ArrayList<>();
        pelis.add(new Pelicula("El Padrino", 9.2));
        pelis.add(new Pelicula("Interestelar", 8.7));
        pelis.add(new Pelicula("Matrix", 8.5));
        double suma = 0;
        for (Pelicula p : pelis) suma += p.rating;
        System.out.printf("%.1f", suma / pelis.size());
    }
}`,
          answer: '8,8'
        }
      },
      {
        id: '6-2', title: 'Lógica de negocio',
        content: `
<h1>⚙️ Lógica de CineBox</h1>
<p>Creamos servicios para manejar la lógica.</p>
<div class="code-block"><div class="code-header"><span>📄 Servicios.java</span></div><pre><code><span class="kw">class</span> <span class="typ">CineBoxService</span> {
    <span class="typ">ArrayList</span>&lt;<span class="typ">Pelicula</span>&gt; peliculas = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;();

    <span class="kw">void</span> agregarPelicula(<span class="typ">String</span> titulo, <span class="kw">int</span> anio, <span class="typ">String</span> genero) {
        peliculas.add(<span class="kw">new</span> <span class="typ">Pelicula</span>(peliculas.size()+<span class="num">1</span>, titulo, anio, genero, <span class="num">0</span>));
    }

    <span class="typ">ArrayList</span>&lt;<span class="typ">Pelicula</span>&gt; buscarPorGenero(<span class="typ">String</span> genero) {
        <span class="typ">ArrayList</span>&lt;<span class="typ">Pelicula</span>&gt; resultado = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;();
        <span class="kw">for</span> (<span class="typ">Pelicula</span> p : peliculas)
            <span class="kw">if</span> (p.genero.equals(genero)) resultado.add(p);
        <span class="kw">return</span> resultado;
    }

    <span class="typ">Pelicula</span> mejorCalificada() {
        <span class="kw">return</span> peliculas.stream()
            .max((a, b) -> <span class="typ">Double</span>.compare(a.rating, b.rating))
            .orElse(<span class="kw">null</span>);
    }
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
class Pelicula {
    String titulo, genero; double rating;
    Pelicula(String t, String g, double r) { titulo = t; genero = g; rating = r; }
    public String toString() { return titulo; }
}
public class Main {
    public static void main(String[] args) {
        List<Pelicula> pelis = Arrays.asList(
            new Pelicula("Dune", "Sci-Fi", 8.5),
            new Pelicula("El Padrino", "Drama", 9.2),
            new Pelicula("Star Wars", "Sci-Fi", 8.0)
        );
        pelis.stream()
            .filter(p -> p.genero.equals("Sci-Fi"))
            .sorted((a, b) -> Double.compare(b.rating, a.rating))
            .forEach(p -> System.out.println(p));
    }
}`,
          answer: 'Dune\nStar Wars'
        }
      },
      {
        id: '6-3', title: 'Persistencia en archivos',
        content: `
<h1>💾 Persistencia</h1>
<p>Guardamos y cargamos datos desde archivos de texto.</p>
<div class="code-block"><div class="code-header"><span>📄 Persistencia.java</span></div><pre><code><span class="kw">import</span> <span class="typ">java</span>.nio.file.*;

<span class="kw">void</span> guardarPeliculas(<span class="typ">ArrayList</span>&lt;<span class="typ">Pelicula</span>&gt; pelis) <span class="kw">throws</span> <span class="typ">IOException</span> {
    <span class="typ">ArrayList</span>&lt;<span class="typ">String</span>&gt; lineas = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;();
    <span class="kw">for</span> (<span class="typ">Pelicula</span> p : pelis)
        lineas.add(p.id + <span class="str">","</span> + p.titulo + <span class="str">","</span> + p.anio + <span class="str">","</span> + p.genero + <span class="str">","</span> + p.rating);
    <span class="typ">Files</span>.write(<span class="typ">Paths</span>.get(<span class="str">"peliculas.csv"</span>), lineas);
}

<span class="typ">ArrayList</span>&lt;<span class="typ">Pelicula</span>&gt; cargarPeliculas() <span class="kw">throws</span> <span class="typ">IOException</span> {
    <span class="typ">ArrayList</span>&lt;<span class="typ">Pelicula</span>&gt; pelis = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;();
    <span class="kw">for</span> (<span class="typ">String</span> linea : <span class="typ">Files</span>.readAllLines(<span class="typ">Paths</span>.get(<span class="str">"peliculas.csv"</span>))) {
        <span class="typ">String</span>[] partes = linea.split(<span class="str">","</span>);
        pelis.add(<span class="kw">new</span> <span class="typ">Pelicula</span>(...));
    }
    <span class="kw">return</span> pelis;
}</code></pre></div>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `public class Main {
    public static void main(String[] args) {
        String csv = "1,Matrix,1999,Sci-Fi,8.7";
        String[] p = csv.split(",");
        System.out.println(p[1] + " (" + p[2] + ") - " + p[4]);
    }
}`,
          answer: 'Matrix (1999) - 8.7'
        }
      },
      {
        id: '6-4', title: 'Menú interactivo',
        content: `
<h1>🖥️ Menú terminal</h1>
<p>Un menú interactivo con <code>Scanner</code> para manejar CineBox desde consola.</p>
<div class="code-block"><div class="code-header"><span>📄 Menu.java</span></div><pre><code><span class="kw">import</span> <span class="typ">java</span>.util.*;

<span class="kw">public class</span> <span class="typ">CineBoxApp</span> {
    <span class="kw">public static void</span> main(<span class="typ">String</span>[] args) {
        <span class="typ">Scanner</span> sc = <span class="kw">new</span> <span class="typ">Scanner</span>(<span class="typ">System</span>.in);
        <span class="kw">int</span> opcion;
        <span class="kw">do</span> {
            <span class="typ">System</span>.out.println(<span class="str">"1. Agregar película"</span>);
            <span class="typ">System</span>.out.println(<span class="str">"2. Buscar por género"</span>);
            <span class="typ">System</span>.out.println(<span class="str">"3. Mejor calificada"</span>);
            <span class="typ">System</span>.out.println(<span class="str">"4. Salir"</span>);
            opcion = sc.nextInt(); sc.nextLine();
            <span class="cm">// procesar opción...</span>
        } <span class="kw">while</span> (opcion != <span class="num">4</span>);
    }
}</code></pre></div>
<p>Completa el proyecto agregando: búsqueda por actor, reseñas con rating promedio, top 10 películas.</p>
`,
        exercise: {
          prompt: '¿Qué imprime?',
          code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] menu = {"Agregar", "Buscar", "Top 10", "Salir"};
        for (int i = 0; i < menu.length; i++)
            System.out.println((i+1) + ". " + menu[i]);
    }
}`,
          answer: '1. Agregar\n2. Buscar\n3. Top 10\n4. Salir'
        }
      }
    ]
  }
];
