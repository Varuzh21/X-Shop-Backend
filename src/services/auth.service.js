import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

export const AuthService = {
    async findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },

    async createUser(fullName, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
        });
    },

    async comparePasswords(inputPassword, storedPassword) {
        return bcrypt.compare(inputPassword, storedPassword);
    },

    generateToken(payload, secret = 'aaaaaaaaaa', expiresIn = '1h') {
        return jwt.sign(payload, secret, { expiresIn });
    },

    async saveVerificationCode(userId, code, expirationTime) {
        return prisma.verificationCode.create({
            data: {
                userId,
                code,
                expiresAt: expirationTime,
            },
        });
    },

    async findVerificationCode(userId, code) {
        return prisma.verificationCode.findFirst({
            where: {
                userId,
                code: parseInt(code),
                expiresAt: { gt: new Date() },
            },
        });
    },

    async deleteVerificationCode(id) {
        return prisma.verificationCode.delete({ where: { id } });
    },

    async updateUserPassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    },
};
