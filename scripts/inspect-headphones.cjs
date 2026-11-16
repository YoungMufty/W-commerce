const prisma = require('../backend/src/utils/prismaClient');

async function main() {
  const prods = await prisma.product.findMany({
    where: { title: { contains: 'Headphones' } },
    include: { images: true }
  });
  console.log(`Found ${prods.length} headphone products:`);
  prods.forEach(p => {
    console.log(`- [${p.id}] ${p.title} | imageUrl: ${p.imageUrl}`);
    p.images.forEach(img => console.log(`    img: ${img.url}`));
  });
}

main().finally(() => prisma.$disconnect());
