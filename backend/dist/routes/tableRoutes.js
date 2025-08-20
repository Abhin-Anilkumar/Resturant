"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tableController_1 = require("../controllers/tableController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', tableController_1.listTables);
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)('ADMIN'), tableController_1.createTable);
router.put('/:id', auth_1.authenticate, (0, auth_1.requireRole)('ADMIN'), tableController_1.updateTable);
exports.default = router;
//# sourceMappingURL=tableRoutes.js.map