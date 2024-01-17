import { Controller, Get, Post, Body, Patch, Param, Delete, Version } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, userOpenAPIDef } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';


@ApiTags("User API")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiProperty(userOpenAPIDef)
  @Post()
  @Version("1")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Version("1")
  findAll() {
    return this.usersService.findAll();
  }

  @ApiParam({ name: "id", required: true, description: "Userid" })
  @Get(':id')
  @Version("1")
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiParam({ name: "id", required: true, description: "Userid" })
  @ApiProperty(userOpenAPIDef)
  @Patch(':id')
  @Version("1")
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiParam({ name: "id", required: true, description: "Userid" })
  @Delete(':id')
  @Version("1")
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
