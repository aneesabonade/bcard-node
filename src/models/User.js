import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 256,
      },
      middle: {
        type: String,
        default: "",
        trim: true,
        maxlength: 256,
      },
      last: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 256,
      },
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
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 256,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    image: {
      url: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        trim: true,
      },
      alt: {
        type: String,
        default: "User profile image",
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

    isBusiness: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);