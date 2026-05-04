const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("🔢 Generador de Números Primos hasta N");
  console.log("=====================================\n");

  const n = await question("Ingresa el número máximo (N): ");
  const maxNumber = parseInt(n);

  if (isNaN(maxNumber) || maxNumber < 2) {
    console.log("❌ Por favor ingresa un número válido mayor o igual a 2.");
    rl.close();
    return;
  }

  console.log(`\n⏳ Buscando números primos hasta ${maxNumber}...`);
  console.log(
    '💭 Claude está analizando la mejor forma de generar los primos...\n'
  );

  const conversationHistory = [];

  // Primer mensaje
  const initialMessage = `Necesito generar todos los números primos hasta ${maxNumber} usando el algoritmo de la Criba de Eratóstenes. 
¿Puedes ayudarme a:
1. Explicar brevemente cómo funciona la Criba de Eratóstenes
2. Calcular cuántos números primos hay hasta ${maxNumber}
3. Listar los primeros 20 números primos (o todos si hay menos de 20)`;

  conversationHistory.push({
    role: "user",
    content: initialMessage,
  });

  let response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system:
      "Eres un experto en matemáticas y algoritmos. Ayuda a generar y analizar números primos de manera clara y precisa.",
    messages: conversationHistory,
  });

  let assistantMessage = response.content[0].text;
  conversationHistory.push({
    role: "assistant",
    content: assistantMessage,
  });

  console.log("📊 Análisis de Claude:\n");
  console.log(assistantMessage);
  console.log("\n" + "=".repeat(50) + "\n");

  // Generar los primos localmente
  function sieveOfEratosthenes(n) {
    const primes = [];
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    for (let i = 2; i <= n; i++) {
      if (isPrime[i]) {
        primes.push(i);
        for (let j = i * i; j <= n; j += i) {
          isPrime[j] = false;
        }
      }
    }
    return primes;
  }

  const primes = sieveOfEratosthenes(maxNumber);

  console.log(`✅ Números Primos Generados:`);
  console.log(`Total de primos hasta ${maxNumber}: ${primes.length}`);
  console.log(`\nPrimeros 20 primos: ${primes.slice(0, 20).join(", ")}`);

  if (primes.length > 20) {
    console.log(`...`);
    console.log(`Últimos 5 primos: ${primes.slice(-5).join(", ")}`);
  } else {
    console.log(`\nTodos los primos: ${primes.join(", ")}`);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Segundo mensaje para análisis adicional
  const followUpMessage = `He generado todos los números primos hasta ${maxNumber}.
Tengo ${primes.length} números primos en total.
Los primeros 20 son: ${primes.slice(0, 20).join(", ")}
${primes.length > 20 ? `Los últimos 5 son: ${primes.slice(-5).join(", ")}` : ""}

¿Puedes:
1. Verificar que este conteo sea correcto
2. Dar algunos datos interesantes sobre estos números primos
3. Explicar qué aplicaciones prácticas tienen los números primos`;

  conversationHistory.push({
    role: "user",
    content: followUpMessage,
  });

  console.log("⏳ Claude está analizando los resultados...\n");

  response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system:
      "Eres un experto en matemáticas y algoritmos. Ayuda a generar y analizar números primos de manera clara y precisa.",
    messages: conversationHistory,
  });

  assistantMessage = response.content[0].text;

  console.log("📈 Datos Interesantes:\n");
  console.log(assistantMessage);

  console.log("\n" + "=".repeat(50));
  console.log("✨ Generador de Números Primos Completado");
  console.log("=".repeat(50));

  rl.close();
}

main().catch(console.error);