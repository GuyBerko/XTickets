import mongoose from 'mongoose';

// An interface that describe the properties
// that are required to create a new user
interface UserAttrs {
  id: string;
  email: string;
  name: string;
}

// An interface that describe the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describe the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  name: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) =>
  new User({
    _id: attrs.id,
    ...attrs,
  });

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
