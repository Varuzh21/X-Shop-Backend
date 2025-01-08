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

    static async getAllProducts(req, res, next) {
        try {
            const products = await prisma.product.findMany();
            return res.status(200).json({ products });
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