const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const config = require("../config/config");
const User = require("../models/User");
const Card = require("../models/Card");

function randomBizNumber() {
  return Math.floor(1000000 + Math.random() * 9000000);
}

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Card.deleteMany({});

  const pass = await bcrypt.hash("123456", 10);

  // initial data: 3 users (regular, business, admin) + 3 cards :contentReference[oaicite:21]{index=21}
  const regular = await User.create({
    name: "Regular User",
    email: "regular@test.com",
    password: pass,
    isBusiness: false,
    isAdmin: false,
  });

  const business = await User.create({
    name: "Business User",
    email: "business@test.com",
    password: pass,
    isBusiness: true,
    isAdmin: false,
  });

  const admin = await User.create({
    name: "Admin User",
    email: "admin@test.com",
    password: pass,
    isBusiness: false,
    isAdmin: true,
  });

  const baseCard = {
    title: "My Business",
    subtitle: "Best services",
    description: "We provide awesome services.",
    phone: "0500000000",
    email: "biz@test.com",
    web: "https://example.com",
    imageUrl: "",
    address: {
      country: "Israel",
      city: "Tel Aviv",
      street: "Main",
      houseNumber: 10,
      zip: 0,
    },
  };

  async function createCard(owner, i) {
    let bizNumber = randomBizNumber();
    while (await Card.exists({ bizNumber })) bizNumber = randomBizNumber();

    return Card.create({
      ...baseCard,
      title: `My Business ${i}`,
      bizNumber,
      user_id: owner._id,
      likes: [],
    });
  }

  await createCard(business, 1);
  await createCard(business, 2);
  await createCard(business, 3);

  console.log("Seed done ✅");
  console.log("Login users (password: 123456):");
  console.log("regular@test.com / business@test.com / admin@test.com");

  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});