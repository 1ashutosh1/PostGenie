import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import startHandler from "./src/controllers/startHandler.js";
import mongoose from "mongoose";
import { message } from "telegraf/filters";
import messageHandler from "./src/controllers/messageHandler.js";
import generateHandler from "./src/controllers/generateHandler.js";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_CONNECTION_URL);
  console.log("Database connected!");
} catch (error) {
  console.log("Database connection error:", err);
  process.kill(process.pid, "SIGTERM");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(startHandler);

bot.command('generate', generateHandler);

bot.on(message("text"), messageHandler);

bot.launch();

//Enable Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
