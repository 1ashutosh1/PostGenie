import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },

  TelegramId:{
    type: String,
    required: true
  }
},{timestamps: true});

const Event = mongoose.model('Event', eventSchema);

export default Event;