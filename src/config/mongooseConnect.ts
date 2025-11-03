import * as mongoose from "mongoose";
import { ConnectOptions } from "mongoose";
import { DATABASE_URI } from "./env.config";

const inProduction: boolean = process.env.NODE_ENV === "production";

const connectDB = async (): Promise<void> => {
  mongoose.set({ strictQuery: true });

  try {
    const options: ConnectOptions = {
      autoIndex: inProduction ? false : true,
    };

    await mongoose.connect(String(DATABASE_URI), options);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
