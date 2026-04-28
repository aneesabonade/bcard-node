import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Card from "../models/Card.js";

dotenv.config();

const seedUsers = [
  {
    name: {
      first: "Anees",
      middle: "",
      last: "Abonade",
    },
    phone: "0500000000",
    email: "admin@test.com",
    password: "123456",
    image: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      alt: "Admin user image",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Jerusalem",
      street: "Main",
      houseNumber: 1,
      zip: 90000,
    },
    isBusiness: true,
    isAdmin: true,
  },
  {
    name: {
      first: "Business",
      middle: "",
      last: "User",
    },
    phone: "0501111111",
    email: "business@test.com",
    password: "123456",
    image: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      alt: "Business user image",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Tel Aviv",
      street: "Herzl",
      houseNumber: 10,
      zip: 61000,
    },
    isBusiness: true,
    isAdmin: false,
  },
  {
    name: {
      first: "Regular",
      middle: "",
      last: "User",
    },
    phone: "0502222222",
    email: "user@test.com",
    password: "123456",
    image: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      alt: "Regular user image",
    },
    address: {
      state: "",
      country: "Israel",
      city: "Haifa",
      street: "Ben Gurion",
      houseNumber: 5,
      zip: 33000,
    },
    isBusiness: false,
    isAdmin: false,
  },
];

const createCardForUser = (userId) => ({
  title: "Anees Business",
  subtitle: "Full Stack Developer",
  description: "Business card for a full stack development service.",
  phone: "0503333333",
  email: "business@test.com",
  web: "https://example.com",
  image: {
    url: "https://cdn.pixabay.com/photo/2017/06/10/07/18/list-2389219_960_720.png",
    alt: "Business card image",
  },
  address: {
    state: "",
    country: "Israel",
    city: "Jerusalem",
    street: "Jaffa",
    houseNumber: 20,
    zip: 90000,
  },
  user_id: userId,
});

const importData = async () => {
  try {
    await connectDB();

    await Card.deleteMany();
    await User.deleteMany();

    const createdUsers = [];

for (const userData of seedUsers) {
  const user = await User.create(userData);
  createdUsers.push(user);
}

const businessUser = createdUsers.find(
  (user) => user.email === "business@test.com"
);

    await Card.create(createCardForUser(businessUser._id));

    console.log("✅ Seed data imported successfully");
    console.log("");
    console.log("Test users:");
    console.log("Admin: admin@test.com / 123456");
    console.log("Business: business@test.com / 123456");
    console.log("Regular: user@test.com / 123456");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Card.deleteMany();
    await User.deleteMany();

    console.log("🗑️ Data destroyed successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Destroy failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}