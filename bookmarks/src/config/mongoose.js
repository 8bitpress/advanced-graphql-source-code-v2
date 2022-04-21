import mongoose from "mongoose";

function initMongoose() {
  const connectionUrl = process.env.MONGODB_URL;
  mongoose.connect(connectionUrl);

  mongoose.connection.on("connected", () => {
    console.log(`Mongoose default connection ready at ${connectionUrl}`);
  });

  mongoose.connection.on("error", error => {
    console.log("Mongoose default connection error:", error);
  });
}

export default initMongoose;
