import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DB_TOPIC } from './constants';

@Schema({ collection: DB_TOPIC })
export class topics {
  @Prop()
  name: string;

  @Prop()
  link: string;
}

export const TopicSchema = SchemaFactory.createForClass(topics);
