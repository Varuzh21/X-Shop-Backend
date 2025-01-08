import prisma from "../prisma.js";

class CartController {
    static async addItem(req, res, next) {
        try {
            const { userId, productId, quantity } = req.body;

            const existingCartItem = await prisma.cart.findUnique({
                where: {
                    userId_productId: {
                        userId: userId,
                        productId: productId,
                    },
                },
            });

            if (existingCartItem) {
                const updatedItem = await prisma.cart.update({
                    where: {
                        id: existingCartItem.id,
                    },
                    data: {
                        quantity: existingCartItem.quantity + quantity,
                    },
                });
                return res.json(updatedItem);
            } else {
                const newItem = await prisma.cart.create({
                    data: {
                        userId: userId,
                        productId: productId,
                        quantity: quantity,
                    },
                });
                return res.status(200).json(newItem);
            }
        } catch (error) {
            next(error);
        }
    }

    static async updateQuantity(req, res, next) {
        try {
            const { userId, productId, quantity } = req.body;

            const updatedItems = await prisma.cart.updateMany({
                where: {
                    userId: userId,
                    productId: productId,
                },
                data: {
                    quantity: quantity,
                },
            });

            return res.status(200).json(updatedItems);
        } catch (error) {
            next(error);
        }
    }

    static async removeItem(req, res, next) {
        try {
            const { userId, productId } = req.body;

            const deletedItems = await prisma.cart.deleteMany({
                where: {
                    userId: userId,
                    productId: productId,
                },
            });

            return res.status(200).json(deletedItems);
        } catch (error) {
            next(error);
        }
    }

    static async getCart(req, res, next) {
        try {
            const { userId } = req.params;

            const cartItems = await prisma.cart.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    product: true,
                },
            });

            return res.status(200).json(cartItems);
        } catch (error) {
            next(error);
        }
    }

    static async clearCart(req, res, next) {
        try {
            const { userId } = req.body;

            const deletedItems = await prisma.cart.deleteMany({
                where: {
                    userId: userId,
                },
            });

            return res.status(200).json(deletedItems);
        } catch (error) {
            next(error);
        }
    }
}

export default CartController;