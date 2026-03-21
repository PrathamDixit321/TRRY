const mongoose = require("mongoose");
const uri = "mongodb://ryash1162_db_user:DUb2X43Fp7LpgncY@ac-1wulqxt-shard-00-00.tc916xb.mongodb.net:27017,ac-1wulqxt-shard-00-01.tc916xb.mongodb.net:27017,ac-1wulqxt-shard-00-02.tc916xb.mongodb.net:27017/TRRY?ssl=true&replicaSet=atlas-1wulqxt-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS");
    process.exit(0);
  } catch (err) {
    console.error("FAIL", err);
  }
}
run();
