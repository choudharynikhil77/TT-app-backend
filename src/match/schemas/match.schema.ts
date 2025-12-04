
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/user/user.types';
export type MatchDocument = HydratedDocument<Match>;

@Schema()
export class Match {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  description: string;

  @Prop({required: true, unique: true})
  location: string;

  @Prop({required: true})
  date: string;

  @Prop({required: true})
  time:string;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
