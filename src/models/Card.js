const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    web: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    address: {
      country: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      street: { type: String, required: true, trim: true },
      houseNumber: { type: Number, required: true },
      zip: { type: Number, default: 0 },
    },

    bizNumber: { type: Number, required: true, unique: true },

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);