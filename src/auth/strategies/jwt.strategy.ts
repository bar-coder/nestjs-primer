import { PrismaService } from './../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    // 'jwt_name_for_guard' // a custom name used to identify this strategy by AuthGuard; by default (if not specified) it is 'jwt'
) {
    constructor(
        config: ConfigService, // se avessimo usato il modificatore 'private', avremmo dovuto invocarlo con 'this',
        // ma a livello di chiamata (nel super(), che deve essere invocato prima di tutto), 'this' non è definito
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        if (!!user) {
            delete user.pwd;
            return user; // N.B. any value returned here will be appended to `req.user` object
        }
        return null;
    }
}