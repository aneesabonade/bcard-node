import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 256,
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 256,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1024,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 9,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 256,
    },

    web: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      url: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2017/06/10/07/18/list-2389219_960_720.png",
        trim: true,
      },
      alt: {
        type: String,
        default: "Business card image",
        trim: true,
      },
    },

    address: {
      state: {
        type: String,
        default: "",
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      houseNumber: {
        type: Number,
        required: true,
      },
      zip: {
        type: Number,
        default: 0,
      },
    },

    bizNumber: {
      type: Number,
      unique: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

cardSchema.pre("save", function (next) {
  if (!this.bizNumber) {
    this.bizNumber = Math.floor(1000000 + Math.random() * 9000000);
  }

  next();
});

export default mongoose.model("Card", cardSchema);