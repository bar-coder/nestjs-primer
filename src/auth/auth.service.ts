import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    pwd: hash
                },
                
                select: {
                    // here only fields that want to be returned inside 'user' obj
                    // default are everyone; if one specific is wanted:
                    email: true
                }
                
            })
            return user;
        } catch (error) {
            // Handling error in case user was already registered with same email
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') { // Duplicate key error code from Prisma
                    throw new ForbiddenException('Credentials already taken')
                }
                throw error;
            }
        }
    }

    async signin(dto: AuthDto): Promise<{access_token: string}> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        // 1st guard condition: check user existence
        if (!user) {
            throw new ForbiddenException('Incorrect credentials');
        }

        // 2nd guard condition: password match
        const pwdDoesMatch = await argon.verify(user.pwd, dto.password);

        if (!pwdDoesMatch) {
            throw new ForbiddenException('Incorrect credentials');
        }

        delete user.pwd;

        return { access_token: await this.signToken(user.id, user.email) };
    }

    async signToken(userId: number, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email
        }

        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        });
    }
}
