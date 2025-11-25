import { responseFromUser } from "../dtos/user.dto.js";
import { NotFoundError } from "../errors/systemErrors.js";
import { findUserByUserId, updateUserById } from "../repositories/user.repository.js";

export const updateUserInfo = async (userId, updateDTO) => {
    const user = await findUserByUserId(userId);
    if(!user){
        throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }

    const updated = await updateUserById(userId, updateDTO);

    return responseFromUser(updated);
};