import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // 'Request' must be imported from 'express'!!!
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User as GetUser } from './decorator/user.decorator';
import { User } from 'prisma/prisma-client';

@Controller('users')
export class UserController {

    @UseGuards(
        // AuthGuard('jwt') // Valid but error-prone
        JwtGuard // Better method to deal with magic strings
    )
    @Get('me')
    getMe(
        // @Req() req: Request // valid but error-prone
        @GetUser() user: User,
        @GetUser('id') userId: number // single fields can be extracted
    ) {
        // return req.user

        console.log(userId);
        return user;
    }

    @HttpCode(HttpStatus.I_AM_A_TEAPOT)
    @Get()
    getCupOfTea() {
        return "Your tea is served";
    }
}
