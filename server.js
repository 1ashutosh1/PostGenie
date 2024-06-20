import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import startHandler from "./src/controllers/startHandler.js";

dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(startHandler);

bot.launch();

//Enable Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
