"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenu = exports.updateMenu = exports.createMenu = exports.listMenu = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listMenu = async (_req, res) => {
    const items = await prisma.menuItem.findMany({ orderBy: { name: 'asc' } });
    res.json(items);
};
exports.listMenu = listMenu;
const createMenu = async (req, res) => {
    const { name, description, price, category } = req.body;
    try {
        const item = await prisma.menuItem.create({ data: { name, description, price: Number(price), category } });
        res.status(201).json(item);
    }
    catch (e) {
        res.status(400).json({ error: 'Could not create menu item' });
    }
};
exports.createMenu = createMenu;
const updateMenu = async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, price, category } = req.body;
    try {
        const item = await prisma.menuItem.update({ where: { id }, data: { name, description, price: Number(price), category } });
        res.json(item);
    }
    catch (e) {
        res.status(404).json({ error: 'Menu item not found' });
    }
};
exports.updateMenu = updateMenu;
const deleteMenu = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.menuItem.delete({ where: { id } });
        res.status(204).send();
    }
    catch (e) {
        res.status(404).json({ error: 'Menu item not found' });
    }
};
exports.deleteMenu = deleteMenu;
//# sourceMappingURL=menuController.js.map