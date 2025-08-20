import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listKitchenItems = async (_req: Request, res: Response) => {
  const items = await prisma.orderItem.findMany({
    where: { status: { in: ['NEW', 'IN_PREP'] } },
    include: { menuItem: true, order: { include: { table: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json(items);
};

export const setKitchenItemStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status: 'NEW' | 'IN_PREP' | 'DONE' };
  try {
    const item = await prisma.orderItem.update({ where: { id }, data: { status } });
    // Update order status heuristic similar to orderController
    const remaining = await prisma.orderItem.count({ where: { orderId: item.orderId, status: { not: 'DONE' } } });
    if (remaining === 0) {
      await prisma.order.update({ where: { id: item.orderId }, data: { status: 'SERVED' } });
    } else if (status === 'IN_PREP') {
      await prisma.order.update({ where: { id: item.orderId }, data: { status: 'PREPARING' } });
    }
    res.json(item);
  } catch (e) {
    res.status(404).json({ error: 'Order item not found' });
  }
};

