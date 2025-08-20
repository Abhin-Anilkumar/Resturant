import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getTaxRate = () => {
  const n = Number(process.env.TAX_RATE || '0.1');
  return isNaN(n) ? 0.1 : n;
};

const computeTotals = (order: any, discountPct?: number) => {
  const subtotal = order.items.reduce((sum: number, i: any) => sum + i.quantity * (i.menuItem?.price || 0), 0);
  const discount = discountPct ? (subtotal * (discountPct / 100)) : 0;
  const taxedBase = Math.max(subtotal - discount, 0);
  const tax = +(taxedBase * getTaxRate()).toFixed(2);
  const total = +(taxedBase + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), discount: +discount.toFixed(2), tax, total };
};

export const listPending = async (req: Request, res: Response) => {
  const statuses = ((req.query.status as string) || 'SERVED').split(',');
  const orders = await prisma.order.findMany({
    where: { status: { in: statuses as any } },
    include: { items: { include: { menuItem: true } }, table: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
};

export const getBill = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const discountPct = req.query.discount ? Number(req.query.discount) : undefined;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { menuItem: true } }, table: true } });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const totals = computeTotals(order, discountPct);
  res.json({ order, ...totals, taxRate: getTaxRate(), discountPct: discountPct || 0 });
};

export const finalizeBill = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { discountPct } = req.body as { discountPct?: number };
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { menuItem: true } }, table: true } });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const totals = computeTotals(order, discountPct);
  const updated = await prisma.order.update({ where: { id }, data: { status: 'PAID' } });
  // Free table if no other pending orders
  const pending = await prisma.order.count({ where: { tableId: updated.tableId, status: { in: ['PENDING', 'SERVED'] } } });
  if (pending === 0) await prisma.table.update({ where: { id: updated.tableId }, data: { status: 'VACANT' } });
  res.json({ orderId: updated.id, ...totals, taxRate: getTaxRate(), discountPct: discountPct || 0, status: 'PAID' });
};

