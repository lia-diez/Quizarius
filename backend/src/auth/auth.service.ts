import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './types/user';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private readonly prismaService: PrismaService) { }

    public async register(login: string, password: string, role: string): Promise<{ token: string }> {
        let user = await this.prismaService.user.findFirst({
            where: {
                login: login
            }
        });

        if (user) {
            throw new BadRequestException('User already exists');
        }

        let newUser = {
            id: randomUUID(),
            login: login,
            role: role,

            hashedPassword: await this.hashPassword(password)
        } as User;

        await this.prismaService.user.create({
            data: {
                id: newUser.id,
                login: newUser.login,
                role: newUser.role,
                hashedPassword: newUser.hashedPassword
            }
        });

        return await this.generateToken(newUser.id, newUser.login, newUser.role);
    }

    public async login(login: string, password: string): Promise<{ token: string }> {
        let user = await this.prismaService.user.findFirst({
            where: {
                login: login
            }
        });

        if (user) {
            let passwordVerified = await this.verifyPassword(user.hashedPassword, password);
            if (passwordVerified) {
                return await this.generateToken(user.id, user.login, user.role);
            }
            else {
                throw new UnauthorizedException('Wrong login or password');
            }
        }
    }

    public async getUser(id: string): Promise<{id: string, login:string, role:string}> {
        let user = await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        });

        if (user) {
            return {
                id: user.id,
                login: user.login,
                role: user.role
            };
        }
    }

    private async hashPassword(password: string): Promise<string> {
        try {
            const hash = await argon2.hash(password);
            return hash;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private async verifyPassword(storedHash, passwordToVerify) {
        try {
            const match = await argon2.verify(storedHash, passwordToVerify);
            return match;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private async generateToken(id: string, login: string, role: string): Promise<{ token: string }> {
        const payload = { login: login, id: id, role: role };
        return { token: this.jwtService.sign(payload) };
    }
}
