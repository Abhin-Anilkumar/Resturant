
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  // Seed menu items
  const items = [
    { name: 'Margherita Pizza', description: 'Classic cheese pizza', price: 8.99, category: 'Pizza' },
    { name: 'Veggie Burger', description: 'Grilled patty with veggies', price: 7.49, category: 'Burgers' },
    { name: 'Caesar Salad', description: 'Crisp romaine with dressing', price: 5.99, category: 'Salads' },
  ];
  for (const i of items) {
    await prisma.menuItem.upsert({
      where: { name: i.name },
      update: { description: i.description, price: i.price, category: i.category },
      create: i,
    });
  }

  // Seed tables
  for (let n = 1; n <= 8; n++) {
    await prisma.table.upsert({
      where: { number: n },
      update: {},
      create: { number: n, status: 'VACANT' },
    });
  }

  console.log({ adminSeeded: true, menuSeeded: true, tablesSeeded: true });

  // Staff test user
  const staffHashed = await bcrypt.hash('staff123', 10);
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: { email: 'staff@example.com', password: staffHashed, role: 'STAFF' },
  });

  // Role-specific users
  const users = [
    { email: 'waiter@example.com', password: 'waiter123', role: 'WAITER' as const },
    { email: 'kitchen@example.com', password: 'kitchen123', role: 'KITCHEN' as const },
    { email: 'cashier@example.com', password: 'cashier123', role: 'CASHIER' as const },
  ];
  for (const u of users) {
    const ph = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { email: u.email, password: ph, role: u.role } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
