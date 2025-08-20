
import bcrypt from 'bcryptjs';

async function testPasswordComparison() {
  const plainPassword = 'admin123';
  // This hash is from the successful seed script output
  const hashedPasswordFromDB = '$2b$10$MCKAGiPIGhmhS7fonlicLuCwPUR1VZPuZBHeiK.evp/apXXi/5G2C';

  const isMatch = await bcrypt.compare(plainPassword, hashedPasswordFromDB);
  console.log(`Password match: ${isMatch}`);
}

testPasswordComparison();
