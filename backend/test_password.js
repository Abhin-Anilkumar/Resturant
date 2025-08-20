"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function testPasswordComparison() {
    const plainPassword = 'admin123';
    // This hash is from the successful seed script output
    const hashedPasswordFromDB = '$2b$10$MCKAGiPIGhmhS7fonlicLuCwPUR1VZPuZBHeiK.evp/apXXi/5G2C';
    const isMatch = await bcryptjs_1.default.compare(plainPassword, hashedPasswordFromDB);
    console.log(`Password match: ${isMatch}`);
}
testPasswordComparison();
//# sourceMappingURL=test_password.js.map