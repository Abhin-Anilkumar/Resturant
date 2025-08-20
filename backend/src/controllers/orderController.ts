import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
  const { status } = req.body as { status: string };
  try {
    const order = await prisma.order.update({ where: { id }, data: { status: status as any } });
    if (status === 'BILLING') {
      await prisma.table.update({ where: { id: order.tableId }, data: { status: 'BILLING' } });
    }
    if (status === 'PREPARING' || status === 'PENDING' || status === 'SERVED') {
      await prisma.table.update({ where: { id: order.tableId }, data: { status: 'OCCUPIED' } });
    }
    if (status === 'PAID' || status === 'CANCELED') {
      // Free table if no other pending orders
      const pending = await prisma.order.count({ where: { tableId: order.tableId, status: { in: ['PENDING', 'PREPARING', 'SERVED'] } } });
      if (pending === 0) {
        await prisma.table.update({ where: { id: order.tableId }, data: { status: 'VACANT' } });
      }
    }
    res.json(order);
  } catch (e) {
    res.status(404).json({ error: 'Order not found' });
  }
};

export const updateOrderItemStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.itemId);
  const { status } = req.body as { status: 'NEW' | 'IN_PREP' | 'DONE' };
  try {
    const item = await prisma.orderItem.update({ where: { id }, data: { status } });
    // If all items in the order are DONE, mark order as SERVED
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
