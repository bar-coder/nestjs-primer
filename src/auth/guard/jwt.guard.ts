import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') { // 'jwt' is called 'magic string'; check 'jwt.strategy.ts' file to understand why it's jwt
    constructor() {
        super();
    }
}
