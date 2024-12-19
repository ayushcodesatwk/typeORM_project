import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Users } from '../entities/user';  

const JWT_SECRET = 'chickiwikichicki';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log(token);
        
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        
        const userRepo = AppDataSource.getRepository(Users);
        const user = await userRepo.findOne({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
