import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/search/:id')
  findById(@Request() req) {
    return this.usersService.findById(req.params.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('@me')
  getMe(@Request() req) {
    return req.user;
  }

  @UseGuards(AccessTokenGuard)
  @Patch('@me')
  updateMe(@Request() req, @Body() body) {
    return this.usersService.update(req.user.id, body);
  }
}
