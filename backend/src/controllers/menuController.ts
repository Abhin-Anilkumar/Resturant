import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listMenu = async (_req: Request, res: Response) => {
  const items = await prisma.menuItem.findMany({ orderBy: { name: 'asc' } });
  res.json(items);
};

export const createMenu = async (req: Request, res: Response) => {
  const { name, description, price, category } = req.body;
  try {
    const item = await prisma.menuItem.create({ data: { name, description, price: Number(price), category } });
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: 'Could not create menu item' });
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, price, category } = req.body;
  try {
    const item = await prisma.menuItem.update({ where: { id }, data: { name, description, price: Number(price), category } });
    res.json(item);
  } catch (e) {
    res.status(404).json({ error: 'Menu item not found' });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.menuItem.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: 'Menu item not found' });
  }
};

