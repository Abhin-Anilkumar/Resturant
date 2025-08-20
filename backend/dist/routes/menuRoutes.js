"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menuController_1 = require("../controllers/menuController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', menuController_1.listMenu);
router.post('/', auth_1.authenticate, (0, auth_1.requireRole)('ADMIN'), menuController_1.createMenu);
router.put('/:id', auth_1.authenticate, (0, auth_1.requireRole)('ADMIN'), menuController_1.updateMenu);
router.delete('/:id', auth_1.authenticate, (0, auth_1.requireRole)('ADMIN'), menuController_1.deleteMenu);
exports.default = router;
//# sourceMappingURL=menuRoutes.js.map