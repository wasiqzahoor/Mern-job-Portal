const mongoose = require("mongoose");

async function removeIndex() {
  await mongoose.connect(process.env.CONNECTION_STRING);
  await mongoose.connection.db.collection("users").dropIndex("username_1");
  console.log("Dropped index username_1");
  mongoose.disconnect();
}

removeIndex();
