const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
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
        "To Do",
        "In Progress",
        "Completed",
      ],
      default: "To Do",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },

    due_date: {
      type: String,
      default: "",
    },

    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    /*
      IMPORTANT:
      This stores the specific user
      who has to perform the task.
    */
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignment_score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    assignment_reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


/*
  Helps MongoDB quickly find tasks
  belonging to a particular user.
*/
taskSchema.index({
  assigned_to: 1,
});


/*
  Useful when filtering project tasks.
*/
taskSchema.index({
  project_id: 1,
});


/*
  Useful for project + assigned user queries.
*/
taskSchema.index({
  project_id: 1,
  assigned_to: 1,
});


taskSchema.set(
  "toJSON",
  {
    transform: (doc, ret) => {
      ret.id =
        ret._id.toString();

      delete ret._id;
      delete ret.__v;

      return ret;
    },
  }
);


module.exports =
  mongoose.model(
    "Task",
    taskSchema
  );