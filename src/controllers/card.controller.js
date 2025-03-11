import prisma from '../prisma.js';
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51QeFlsDGRxLHfL2YHERA8oK8jihUxHOlQOzt4KCU27lUp3o84VCjPlwNdWRRP6Wj2wiW76t02F9jW3aIptzD1rQQ00EziCnWhj");

class CardController {
    static async createCard(req, res, next) {
        try {
            const { cardNumber, expiration, securityCode, userId, cardName, type, billingAddress } = req.body;

            if (!userId || !cardNumber || !expiration || !securityCode || !billingAddress || !cardName || !type) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            let stripeCustomerId = user.stripeCustomerId;

            if (!stripeCustomerId) {
                const customer = await stripe.customers.create({
                    email: user.email,
                });

                stripeCustomerId = customer.id;

                await prisma.user.update({
                    where: { id: userId },
                    data: { stripeCustomerId },
                });
            }

            const [expiryMonth, expiryYear] = expiration.split('/');
            const currentTimestamp = new Date().toISOString();

            const newCard = await prisma.card.create({
                data: {
                    user: { connect: { id: user.id } },
                    billingAddress,
                    expiryMonth: parseInt(expiryMonth),
                    expiryYear: parseInt(expiryYear),
                    cardNumber: cardNumber,
                    expiryDate: expiration,
                    cvv: securityCode,
                    createdAt: currentTimestamp,
                    updatedAt: currentTimestamp
                }
            })

            res.status(201).json(newCard);
        } catch (error) {
            console.error('Error creating card:', error);
            next({ message: 'An error occurred while creating the card' });
        }
    }

    static async getUserCards(req, res, next) {
        try {
            const { userId } = req.params;

            const userCards = await prisma.card.findMany({
                where: { userId: parseInt(userId) },
                select: {
                    id: true,
                    expiryMonth: true,
                    expiryYear: true,
                    cardNumber: true,
                    billingAddress: true,
                },
            });

            res.status(200).json(userCards);
        } catch (error) {
            console.error('Error fetching user cards:', error);
            next({ message: 'An error occurred while fetching the cards' });
        }
    }

    static async deleteCard(req, res, next) {
        try {
            const { id } = req.params;

            const card = await prisma.card.findUnique({
                where: { id: parseInt(id) },
            });

            if (!card) {
                return res.status(404).json({ message: 'Card not found' });
            }

            const user = await prisma.user.findUnique({
                where: { id: card.userId },
            });

            if (user && user.stripeCustomerId) {
                await stripe.customers.deleteSource(user.stripeCustomerId, card.cardStripeId);
            }

            await prisma.card.delete({
                where: { id: parseInt(id) },
            });

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting card:', error);
            next({ message: 'An error occurred while deleting the card' });
        }
    }
}

export default CardController;