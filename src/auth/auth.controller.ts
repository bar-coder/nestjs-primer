import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, ParseIntPipe, Post, Req, Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // POST /auth/signup

    // -- NOT CORRECT --
    // @Post('signup')
    // signup(@Req() req: Request) { // In questo modo si sta accedendo all'oggetto 'req' di 'Express'! Ma non si vuole questo per mantenere la compatibilità di Nest con più framework!
    //     console.log(req.body);
        
    //     return this.authService.signup();
    // }


    // -- THE CORRECT WAY: it extracts single items from body for validation purposes --
    // @Post('signup')
    // signup(
    //     @Body('email') email: string,
    //     @Body('password') password: string,
    //     @Body('age', ParseIntPipe) age: string //  N.B. Simple validation: for most compelete ones check the 'auth.dto.ts' + 'main.ts'
    // ) {
    //     return this.authService.signup({
    //         email,
    //         password
    //     });
    // }

    // -- THE BEST WAY --
    @Post('signup')
    signup(@Body() dto: AuthDto) { // N.B. Da notare l'uso dell'interfaccia per la validazione
        return this.authService.signup(dto);
    }


    // POST /auth/signup
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}
