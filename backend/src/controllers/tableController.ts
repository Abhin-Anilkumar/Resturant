import { Request, Response } from 'express';
import { PrismaClient, TableStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const listTables = async (_req: Request, res: Response) => {
  const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } });
  res.json(tables);
};

export const createTable = async (req: Request, res: Response) => {
  const { number, status } = req.body as { number: number; status?: TableStatus };
  try {
    const table = await prisma.table.create({ data: { number: Number(number), status: status || 'VACANT' } });
    res.status(201).json(table);
  } catch (e) {
    res.status(400).json({ error: 'Could not create table (duplicate number?)' });
  }
};

export const updateTable = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { number, status } = req.body as { number?: number; status?: TableStatus };
  try {
    const data: any = {};
    if (typeof number !== 'undefined') data.number = Number(number);
    if (typeof status !== 'undefined') data.status = status;
    const table = await prisma.table.update({ where: { id }, data });
    res.json(table);
  } catch (e) {
    res.status(404).json({ error: 'Table not found' });
  }
};
