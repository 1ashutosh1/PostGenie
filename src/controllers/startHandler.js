import User from "../models/User.model.js";

const startHandler = async (ctx) => {
  const from = ctx.update.message.from;
  console.log("From", from);
  try {
    await User.findOneAndUpdate(
      { TelegramId: from.id },
      {
        $setOnInsert: {
          firstName: from.first_name,
          lastName: from.last_name,
          isBot: from.is_bot,
          username: from.username,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    await ctx.reply(
      `Hey! ${from.first_name}, Welcome. I will be writing highly engaging social media posts for you 🚀 Just Keep feeding me with the events through the day. Let's Shine on Social Media By Posting Your Best Ideas ✨`
    );
  } catch (error) {
    console.log(error);
    await ctx.reply('There is Some Issue Please try again after some time');
  }
}

export default startHandler;