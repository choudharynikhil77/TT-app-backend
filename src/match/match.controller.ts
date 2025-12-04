import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/user.types';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.createMatch(createMatchDto);
  }

  @Get()
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(+id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(+id);
  }
}
