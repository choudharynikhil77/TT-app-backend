import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
