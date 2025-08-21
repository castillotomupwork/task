import User from "../models/user";
import { UserDocument } from "../interfaces/user-document";
import { UserInput } from "../interfaces/user-input";

export const createUser = async (userData: UserInput): Promise<UserDocument> => {
  const user = new User(userData);

  return await user.save();
};

export const getUsers = async (): Promise<UserDocument[]> => {
  return await User.find();
};

export const getUserById = async (id: string): Promise<UserDocument | null> => {
  return await User.findOne({ _id: id, isDeleted: false });
};

export const isUsernameTaken = async (
  username: string,
  excludeId?: string
): Promise<UserDocument | null> => {
  const query: any = { username };

  if (excludeId) { 
    query._id = { $ne: excludeId };
  }

  return await User.findOne(query);
};

export const isEmailTaken = async (
  email: string,
  excludeId?: string
): Promise<UserDocument | null> => {
  const query: any = { email };

  if (excludeId) { 
    query._id = { $ne: excludeId };
  }

  return await User.findOne(query);
};

export const updateUser = async (
  id: string, 
  updateData: Partial<UserInput>
): Promise<UserDocument | null> => {
  
  return await User.findByIdAndUpdate(id, updateData, { 
    new: true, 
    runValidators: true 
  });
};

export const deleteUser = async (id: string): Promise<UserDocument | null> => {
  const user = await User.findById(id);

  if (!user) {
    return null;
  }

  user.isDeleted = true;

  await user.save();

  return user;
};
