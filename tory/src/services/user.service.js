import { addUserToDB } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";

export const addUser = async (userDTO) => {
  const createdUser = await addUserToDB(userDTO);
  return responseFromUser(createdUser);
};