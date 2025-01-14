import prisma from '../prisma.js';

class CategoryService {
    static async getAllCategories() {
        return prisma.category.findMany({
            select: {
                id: true,
                name: true,
            }
        });
    }

    static async getCategoryById(id) {
        return prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
    }

    static async createCategory(name, description) {
        return prisma.category.create({
            data: { name, description },
        });
    }

    static async updateCategory(id, name, description) {
        return prisma.category.update({
            where: { id },
            data: { name, description },
        });
    }

    static async deleteCategory(id) {
        return prisma.category.delete({
            where: { id },
        });
    }
}

export default CategoryService;
