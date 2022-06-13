import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';

@Global() // Needed to be imported just in the main 'app.module.ts'
@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}
