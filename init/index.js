const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// connect db
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  const listingsWithOwner = initData.data.map((listing) => {
    return { ...listing, owner: "6726501db5903bec7683ed7e" };
  });
  await Listing.insertMany(listingsWithOwner);
  console.log("data was initialized");
};

initDB().then(() => {
  mongoose.connection.close();
});
