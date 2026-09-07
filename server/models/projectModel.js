const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Planning",
        "In Progress",
        "Completed",
      ],
      default: "Planning",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    dueDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;
  },
});

module.exports =
  mongoose.model(
    "Project",
    projectSchema
  );