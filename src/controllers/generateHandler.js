import GenerateOutput from "../gemini/apicall.js";
import Event from "../models/Event.model.js";
import User from "../models/User.model.js";


const generateHandler = async(ctx) => {
  const from = ctx.update.message.from;
  
  const {message_id: waitingMessageId} = await ctx.reply(`Hey! ${from.first_name}, Kindly wait for a moment. I am curating posts for you 🚀⏳`)

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
    await ctx.reply('No Events for the Day');
    return;
   }

   console.log("events", events);
   
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
     await ctx.reply(obj.text);
   } catch (error) {
    console.log("Error in generate Handler", error);
     console.log("Facing Difficulties");
   }

   
   //send response 
  
}

export default generateHandler;