import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  pwd: { type: String },
  phone: { type: String },
});
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
