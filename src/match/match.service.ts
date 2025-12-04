import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Match } from './schemas/match.schema';
import { Model } from 'mongoose';

@Injectable()
export class MatchService {

  constructor(@InjectModel(Match.name) private matchModel: Model<Match>) {}
  async createMatch(createMatchDto: CreateMatchDto) {
    try{const match = this.matchModel.create({
      name: createMatchDto.name,
      description: createMatchDto.description,
      location: createMatchDto.location,
      date: createMatchDto.date,
      time: createMatchDto.time
    });
    return {message: "Match created successfully", match}
  }
  catch(err){
    return {message: "Error creating match", err}
  }
}

  findAll() {
    return `This action returns all match`;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
