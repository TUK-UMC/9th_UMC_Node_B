import bcrypt from "bcrypt";
import { addUser, isExistSocialId } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { RequestError } from "../utils/systemErrors.js";


export const userSignUp = async (data) => {
const exist = await isExistSocialId(data.social_id);
if (exist) throw new RequestError("이미 존재하는 소셜 계정입니다.");


const saltRounds = 10;
const hashedPassword = await bcrypt.hash(data.password, saltRounds);
const userId = await addUser({ ...data, password: hashedPassword });


return responseFromUser({ user_id: userId, ...data });
};