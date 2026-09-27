import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE - Criar novo usuário
export async function createUser(req: Request, res: Response) {
  try {
    const { email, name, age } = req.body;

    // Validação básica
    if (!email || !name) {
      return res.status(400).json({
        error: "Email e name são obrigatórios"
      });
    }

    // Verificar se email já existe
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return res.status(409).json({
        error: "Email já cadastrado"
      });
    }

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        name,
        age: age ? parseInt(age) : null
      }
    });

    return res.status(201).json({
      message: "✅ Usuário criado com sucesso",
      user
    });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({
      error: "Erro ao criar usuário",
      details: error.message
    });
  }
}

// READ - Obter todos os usuários
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      total: users.length,
      users
    });
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({
      error: "Erro ao buscar usuários"
    });
  }
}

// READ - Obter usuário por ID
export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado"
      });
    }

    return res.json(user);
  } catch (error: any) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({
      error: "Erro ao buscar usuário"
    });
  }
}

// UPDATE - Atualizar usuário
export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { email, name, age } = req.body;

    // Verificar se usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      return res.status(404).json({
        error: "Usuário não encontrado"
      });
    }

    // Verificar se novo email já existe (se for alterado)
    if (email && email !== userExists.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(409).json({
          error: "Email já cadastrado"
        });
      }
    }

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: email || userExists.email,
        name: name || userExists.name,
        age: age !== undefined ? (age ? parseInt(age) : null) : userExists.age
      }
    });

    return res.json({
      message: "✅ Usuário atualizado com sucesso",
      user
    });
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({
      error: "Erro ao atualizar usuário"
    });
  }
}

// DELETE - Deletar usuário
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Verificar se usuário existe
    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      return res.status(404).json({
        error: "Usuário não encontrado"
      });
    }

    // Deletar usuário
    await prisma.user.delete({
      where: { id }
    });

    return res.json({
      message: "✅ Usuário deletado com sucesso"
    });
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({
      error: "Erro ao deletar usuário"
    });
  }
}
