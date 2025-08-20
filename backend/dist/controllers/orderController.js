"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = exports.listOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listOrders = async (_req, res) => {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { menuItem: true } }, table: true },
    });
    res.json(orders);
};
exports.listOrders = listOrders;
const createOrder = async (req, res) => {
    const { tableId, items } = req.body;
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
    }
    catch (e) {
        res.status(400).json({ error: 'Could not create order' });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;
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
    }
    catch (e) {
        res.status(404).json({ error: 'Order not found' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=orderController.js.map