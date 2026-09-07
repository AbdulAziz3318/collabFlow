const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      full_name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        enum: [
          "Admin",
          "Manager",
          "Member",
        ],
        default: "Member",
      },

      skills: {
        type: [String],
        default: [],
      },

      specialization: {
        type: String,
        default: "",
      },

      experience_years: {
        type: Number,
        default: 0,
      },

      resume_file_name: {
        type: String,
        default: "",
      },

      resume_text: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

userSchema.set(
  "toJSON",
  {
    transform: (
      doc,
      ret
    ) => {
      ret.id =
        ret._id.toString();

      delete ret._id;
      delete ret.__v;
      delete ret.password;

      /*
       Don't expose full resume
       text to frontend.
      */
      delete ret.resume_text;

      return ret;
    },
  }
);

module.exports =
  mongoose.model(
    "User",
    userSchema
  );