import Event from "../models/Event.model.js";

const generateHandler = async(ctx) => {
  const from = ctx.update.message.from;

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);


   // get events of the user for today
   const events = Event.find({
     TelegramId: from.id,
     createdAt: {
       $gte: startOfDay,
       $lte: endOfDay,
     }
   });

   if(events.length === 0){
    await ctx.reply('No Events for the Day');
    return;
   }

   console.log("events", events);

   // make gemini api call
   // store token count(so that we are able to know how many tokens are being used up by each user)
   //send response 
   await ctx.reply('Doing somethings...')
}

export default generateHandler;