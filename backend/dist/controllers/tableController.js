"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTable = exports.createTable = exports.listTables = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listTables = async (_req, res) => {
    const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } });
    res.json(tables);
};
exports.listTables = listTables;
const createTable = async (req, res) => {
    const { number, status } = req.body;
    try {
        const table = await prisma.table.create({ data: { number: Number(number), status: status || 'VACANT' } });
        res.status(201).json(table);
    }
    catch (e) {
        res.status(400).json({ error: 'Could not create table (duplicate number?)' });
    }
};
exports.createTable = createTable;
const updateTable = async (req, res) => {
    const id = Number(req.params.id);
    const { number, status } = req.body;
    try {
        const data = {};
        if (typeof number !== 'undefined')
            data.number = Number(number);
        if (typeof status !== 'undefined')
            data.status = status;
        const table = await prisma.table.update({ where: { id }, data });
        res.json(table);
    }
    catch (e) {
        res.status(404).json({ error: 'Table not found' });
    }
};
exports.updateTable = updateTable;
//# sourceMappingURL=tableController.js.map