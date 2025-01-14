import prisma from "../prisma.js";

class ProductsController {
    static async createProduct(req, res, next) {
        try {
            const { name, price, description, stock, rating, size, categoryId, thumbnail } = req.body;

            if (!name || !price || !description || !stock || !categoryId, !size) {
                return res.status(404).json({ message: "All required fields must be provided" });
            }

            const newProduct = await prisma.product.create({
                data: { name, price, description, stock, rating, categoryId, thumbnail, size },
            });

            return res.status(201).json({
                message: "Product created successfully",
                product: newProduct,
            });
        } catch (error) {
            console.error("Error creating product:", error);
            next(new Error("Failed to create product"));
        }
    }

    static async getProductByCategoryId(req, res, next) {
        try {
            const categoryId = parseInt(req.params.categoryId, 10);

            if (isNaN(categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;
    
            const [total, products] = await prisma.$transaction([
                prisma.product.count({
                    where: { categoryId },
                }),
                prisma.product.findMany({
                    where: { categoryId },
                    skip,
                    take: limit,
                }),
            ]);
            const totalPages = Math.ceil(total / limit);
    
            if (products.length === 0) {
                return res.status(404).json({ message: "No products found for this category" });
            }
    
            return res.status(200).json({
                data: products,
                pagination: {
                    totalItems: total,
                    currentPage: page,
                    totalPages,
                    limitPerPage: limit,
                },
            });
        } catch (error) {
            console.error("Error retrieving products by category ID:", error);
            next(new Error("Failed to retrieve products by category ID"));
        }
    }

    static async getAllProducts(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;

            const [total, products] = await prisma.$transaction([
                prisma.product.count(),
                prisma.product.findMany({
                    skip,
                    take: limit, 
                }),
            ]);

            const totalPages = Math.ceil(total / limit);

            return res.status(200).json({
                data: products,
                pagination: {
                    totalItems: total,
                    currentPage: page,
                    totalPages,
                    limitPerPage: limit,
                },
            });
        } catch (error) {
            console.error("Error retrieving products:", error);
            next(new Error("Failed to retrieve products"));
        }
    }

    static async getProductById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }

            const product = await prisma.product.findUnique({
                where: { id },
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            return res.status(200).json({ product });
        } catch (error) {
            console.error("Error retrieving product by ID:", error);
            next(new Error("Failed to retrieve product"));
        }
    }

    static async updateProduct(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }

            const { name, price, description, stock, rating, categoryId, thumbnail } = req.body;

            const updatedProduct = await prisma.product.update({
                where: { id },
                data: { name, price, description, stock, rating, categoryId, thumbnail },
            });

            return res.status(200).json({
                message: "Product updated successfully",
                product: updatedProduct,
            });
        } catch (error) {
            console.error("Error updating product:", error);
            next(new Error("Failed to update product"));
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }

            await prisma.product.delete({
                where: { id },
            });

            return res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            console.error("Error deleting product:", error);
            next(new Error("Failed to delete product"));
        }
    }
}

export default ProductsController;