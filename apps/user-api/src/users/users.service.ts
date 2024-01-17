import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(REQUEST) private request: Request,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create({
      name: createUserDto.name,
      email: createUserDto.email,
      userID: crypto.randomUUID(),
    });
    await this.cacheManager.del(this.request.url);
    return { name: user.name, email: user.email, userID: user.userID };
  }

  findAll() {
    return this.userModel.find().select('-_id -__v');
  }

  findOne(id: string) {
    return this.userModel.find({ userID: id }).select('-_id -__v');
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const update = await this.userModel.updateOne(
      { userID: id },
      {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    );
    if (update.matchedCount === 0) {
      throw new HttpException('Not updated', HttpStatus.NOT_FOUND);
    }
    if (update.modifiedCount === 0) {
      await this.cacheManager.del(this.request.url.replace(`/${id}`, ''));
    }
    return { name: updateUserDto.name, email: updateUserDto.email, userID: id };
  }

  async remove(id: string) {
    const deleted = await this.userModel.deleteOne({ userID: id });
    if (deleted.deletedCount === 0) {
      throw new HttpException('Not deleted', HttpStatus.NOT_FOUND);
    }
    await this.cacheManager.del(this.request.url);
    await this.cacheManager.del(this.request.url.replace(`/${id}`, ''));
    return { userID: id };
  }
}
