import { Response } from "express";
import { ExpressRequest } from "../app";
import usersRepository from "../repository/users.repository";
import { throwIfUndefined } from "../utils";

export async function getAuth(req: ExpressRequest, res: Response) {
  const user = throwIfUndefined(req.user, "req.user");

  const getUser = await usersRepository.findOne({
    id: user.id,
  });

  if (!getUser) {
    return {
      error: "User not found",
    };
  }

  return getUser;
}
