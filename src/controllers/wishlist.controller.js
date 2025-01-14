import prisma from "../prisma.js";

class WishlistController {
    static async getAllByUser(req, res, next) {
        const { userId } = req.params;

        try {
            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid userId" });
            }

            const wishlist = await prisma.wishlist.findMany({
                where: { userId: parseInt(userId, 10) },
                include: { product: true },
            });

            if (!wishlist.length) {
                return res.status(200).json({ message: "Wishlist is empty" });
            }

            return res.status(200).json(wishlist);
        } catch (error) {
            next({ status: 500, message: error.message });
        }
    }

    static async addWish(req, res, next) {
        try {
            const { userId } = req.params;
            const { productId } = req.body;

            if (!userId || !productId || isNaN(userId) || isNaN(productId)) {
                return res.status(400).json({ message: "Invalid input data" });
            }

            const newWish = await prisma.wishlist.create({
                data: {
                    userId: parseInt(userId, 10),
                    productId: parseInt(productId, 10)
                },
                include: { product: true },
            });

            res.status(201).json(newWish);
        } catch (error) {
            next({ status: 500, message: error.message });
        }
    }

    static async removeWish(req, res, next) {
        const { userId, productId } = req.body;

        try {
            if (!userId || !productId || isNaN(userId) || isNaN(productId)) {
                return res.status(400).json({ message: "Invalid input data" });
            }

            const wish = await prisma.wishlist.findFirst({
                where: {
                    userId: parseInt(userId, 10),
                    productId: parseInt(productId, 10)
                },
            });

            if (!wish) {
                return res.status(404).json({ message: "Wish not found" });
            }

            const removedWish = await prisma.wishlist.delete({
                where: { id: wish.id },
            });

            return res.status(200).json({
                message: "Wish successfully removed",
            });
        } catch (error) {
            next({ status: 500, message: error.message });
        }
    }
}

export default WishlistController;