import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
},{
  collections:"projects"
});

export default mongoose.model("Project", projectSchema);
