import GenerateOutput from "../gemini/apicall.js";
import Event from "../models/Event.model.js";
import User from "../models/User.model.js";

const MAX_TOKENS_PER_DAY = 5000;

const generateHandler = async(ctx) => {
  const from = ctx.update.message.from;
  
  const user = await User.findOne({ TelegramId: from.id });
  if (!user) {
    await ctx.reply('User not found');
    return;
  }

  if (user.promptTokens + user.completionTokens >= MAX_TOKENS_PER_DAY) {
    await ctx.reply('Token limit reached for the day');
    return;
  }

  const {message_id: waitingMessageId} = await ctx.reply(`Hey! ${from.first_name}, Kindly wait for a moment. I am curating posts for you 🚀⏳`);

  const {message_id: loadingStickerId} = await ctx.replyWithSticker('CAACAgIAAxkBAANZZnXD02WGKP1aFjiBxnCijJM6I6sAAjgLAAJO5JlLMrFH0tlPjNA1BA');

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);


   // get events of the user for today
   const events = await Event.find({
     TelegramId: from.id,
     createdAt: {
       $gte: startOfDay,
       $lte: endOfDay,
     }
   });

   if(events.length === 0){
    await ctx.deleteMessage(waitingMessageId);
    await ctx.deleteMessage(loadingStickerId);
    await ctx.reply('No Events for the Day');
    return;
   }

   
   //a string of all the events that the user registered till now
   const eventsofDay = events.map((event) => event.text).join(', ');
 
   // make gemini api call
   try {
     const obj = await GenerateOutput(eventsofDay);
     // store token count(so that we are able to know how many tokens are being used up by each user)
     
     try {
      await User.findOneAndUpdate({
        TelegramId: from.id,
       },{
        $inc: {
          promptTokens: obj.promptTokens,
          completionTokens: obj.completionTokens,
        }
       });
     } catch (error) {
       console.log("Error Updating the user");
     }

     await ctx.deleteMessage(waitingMessageId);
     await ctx.deleteMessage(loadingStickerId);
     await ctx.reply(obj.text);
   } catch (error) {
    console.log("Error in generate Handler", error);
     await ctx.reply('Facing Difficulties')
   }

   
   //send response 
  
}

export default generateHandler;