import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  //id: Number,
  id: { type: Number, unique: true, required: true},
  title: { type: String, unique: true, required: true}
  //title: String
});

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true},
  password: {type: String, required: true },
  favourites: [MovieSchema]
});

export default mongoose.model('User', UserSchema);