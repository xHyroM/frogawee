import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { ClassesService } from './classes.service';

@Controller('users')
export class ClassesConstroler {
  constructor(private readonly classesService: ClassesService) {}
}
