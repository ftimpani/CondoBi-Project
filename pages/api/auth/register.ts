import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const { email, password, name, role = 'MORADOR', condominioId } = req.body

    // Validações
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' })
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' })
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        condominioId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        condominioId: true,
        createdAt: true,
      }
    })

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    })
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return res.status(500).json({ message: 'Erro ao criar usuário' })
  }
}
