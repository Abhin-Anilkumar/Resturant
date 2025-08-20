import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const listOrders = async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { menuItem: true } }, table: true },
  });
  res.json(orders);
};

export const createOrder = async (req: Request, res: Response) => {
  const { tableId, items } = req.body as { tableId: number; items: { menuItemId: number; quantity: number }[] };
  try {
    const order = await prisma.order.create({
      data: {
        tableId: Number(tableId),
        items: {
          create: items.map((i) => ({ menuItemId: Number(i.menuItemId), quantity: Number(i.quantity) })),
        },
        status: 'PENDING',
      },
      include: { items: { include: { menuItem: true } }, table: true },
    });
    // Mark table occupied
    await prisma.table.update({ where: { id: Number(tableId) }, data: { status: 'OCCUPIED' } });
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ error: 'Could not create order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body as { status: OrderStatus };
  try {
    const order = await prisma.order.update({ where: { id }, data: { status } });
    if (status === 'PAID' || status === 'CANCELED') {
      // Free table if no other pending orders
      const pending = await prisma.order.count({ where: { tableId: order.tableId, status: 'PENDING' } });
      if (pending === 0) {
        await prisma.table.update({ where: { id: order.tableId }, data: { status: 'VACANT' } });
      }
    }
    res.json(order);
  } catch (e) {
    res.status(404).json({ error: 'Order not found' });
  }
};

