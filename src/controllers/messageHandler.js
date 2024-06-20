import Event from "../models/Event.model.js";

const messageHandler = async (ctx) => {
  const from = ctx.update.message.from;
  const message = ctx.update.message.text;
  // console.log(ctx);
  try {
    await Event.create({
      text: message,
      TelegramId: from.id,
    });
    await ctx.reply("Noted 👍, Keep texting me your thoughts. To generate the posts, just enter the command: /generate");
  } catch (error) {
    console.log(error);
    await ctx.reply('Facing Difficulties, Please try again later');
  }
}

export default messageHandler;