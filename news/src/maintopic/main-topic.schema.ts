import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DB_MAINTOPIC } from './constants';

@Schema({collection :DB_MAINTOPIC})
export class mainTopics {
  @Prop()
  name: string;

  @Prop()
  link: string;
  
}
export const MainTopicSchema = SchemaFactory.createForClass(mainTopics);
