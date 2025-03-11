import { AuthService } from '../services/auth.service.js';
import nodemailer from 'nodemailer';

class AuthController {
    static async createUser(req, res, next) {
        try {
            const { email, fullName, password } = req.body;

            if (!fullName || !email || !password) {
                return res.status(400).json({
                    message: 'Full name, email, and password are required.'
                });
            }

            if (typeof fullName !== 'string' || fullName.trim().length < 3) {
                return res.status(400).json({
                    message: 'Full name must be at least 3 characters long.',
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: 'Please provide a valid email address.',
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message: 'Password must be at least 6 characters long.',
                });
            }

            const existingUser = await AuthService.findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    message: 'User already exists.',
                });
            }

            await AuthService.createUser(fullName, email, password);

            return res.status(201).json({
                data: {
                    status: 201,
                    message: 'User created successfully.',
                },
            });
        } catch (error) {
            console.error(error);
            return next.status(500).json({ message: 'An error occurred while creating the user.' });
        }
    }

    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await AuthService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isPasswordValid = await AuthService.comparePasswords(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const accessToken = AuthService.generateToken({ userId: user.id, email: user.email });

            return res.status(200).json({
                accessToken,
                userId: user.id
            });
        } catch (error) {
            console.error(error);
            next(new Error('Failed to log in user'));
        }
    }

    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            const user = await AuthService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 15);

            await AuthService.saveVerificationCode(user.id, verificationCode, expirationTime);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'varujan.grigoryan.2017@gmail.com',
                    // pass: 'Varuzhan_2002',
                },
            });

            await transporter.sendMail({
                from: 'varujan.grigoryan.2017@gmail.com',
                to: email,
                subject: 'Password Reset Verification Code',
                html: `<p>Your verification code is: ${verificationCode}</p>`,
            });

            return res.status(200).json({ message: 'Verification code sent to email' });
        } catch (error) {
            console.error(error);
            next(new Error('Failed to send verification code'));
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const { email, code, newPassword } = req.body;

            const user = await AuthService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const storedCode = await AuthService.findVerificationCode(user.id, code);

            if (!storedCode) {
                return res.status(400).json({ message: 'Invalid or expired verification code' });
            }

            await AuthService.updateUserPassword(user.id, newPassword);
            await AuthService.deleteVerificationCode(storedCode.id);

            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error(error);
            next(new Error('Failed to reset password'));
        }
    }
}

export default AuthController;