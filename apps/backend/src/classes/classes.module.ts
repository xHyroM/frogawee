import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesConstroler } from './classes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassesConstroler],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
