import express from "express";
import { PrismaClient } from "@prisma/client";
import usersRouter from "./routes/users";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "API is running" });
});

// Rotas
app.use("/api/users", usersRouter);

// Teste de conexão com banco
app.get("/db-test", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ message: "✅ Conexão com banco de dados OK!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Erro ao conectar ao banco" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 API rodando em http://localhost:${PORT}`);
  console.log(`📊 Teste conexão: http://localhost:${PORT}/db-test`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
