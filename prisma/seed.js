import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    { name: "All" },
    { name: "Men’s Clothing" },
    { name: "Women’s Clothing" },
    { name: "T-Shirts" },
    { name: "Shirts" },
    { name: "Jeans" },
    { name: "Trousers & Chinos" },
    { name: "Shorts" },
    { name: "Jackets & Coats" },
    { name: "Hoodies & Sweatshirts" },
    { name: "Suits & Blazers" },
    { name: "Ethnic Wear" },
    { name: "Activewear" },
    { name: "Innerwear & Sleepwear" },
    { name: "Swimwear" },
    { name: 'Party Wear' },
    { name: 'Wedding Wear' },
    { name: 'Festival Wear' },
    { name: 'Office/Formal Wear' },
    { name: 'Casual Wear' },
    { name: 'Loungewear' },
    { name: 'Occasion Wear' },
    { name: 'Sweaters & Cardigans' },
    { name: 'Thermals' },
    { name: 'Woolen Caps' },
    { name: 'Lightweight T-Shirts' },
    { name: 'Cotton Dresses' },
    { name: 'Shorts & Skirts' },
    { name: 'Waterproof Jackets' },
    { name: 'Raincoats' },
    { name: 'Ponchos' }
];

async function main() {
    console.log('Seeding categories...');
    
    for (const category of categories) {
        const existingCategory = await prisma.category.findUnique({
            where: { name: category.name }
        });

        if (!existingCategory) {
            await prisma.category.create({
                data: category,
            });
            console.log(`Category "${category.name}" created.`);
        } else {
            console.log(`Category "${category.name}" already exists.`);
        }
    }

    console.log('Categories seeded successfully!');

    const categoryRecords = await prisma.category.findMany();

    for (let i = 1; i <= 50; i++) {
        const category = categoryRecords[Math.floor(Math.random() * categoryRecords.length)];
        await prisma.product.create({
            data: {
                name: `Product ${i}`,
                description: `Description for product ${i}`,
                size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
                rating: parseFloat((Math.random() * 5).toFixed(2)),
                price: parseFloat((Math.random() * 100).toFixed(2)),
                stock: Math.floor(Math.random() * 50) + 1,
                categoryId: category.id,
                thumbnail: `https://via.placeholder.com/150?text=Product+${i}`,
            },
        });
        console.log(`Product ${i} created.`);
    }

    console.log('Products seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding categories and products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });