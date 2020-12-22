import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  // id: Number,
  // title: String
  id: { type: Number, unique: true, required: true},
  title: { type: String, unique: true, required: true}
});

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true},
  password: {type: String, required: true },
  favourites: [MovieSchema]
});

export default mongoose.model('User', UserSchema);