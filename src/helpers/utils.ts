
import jwt, { Secret } from "jsonwebtoken";
import { AppConfig } from "../config/config"
import { UserInstance } from "../models/User"

const config = AppConfig.config
export const generateAccessToken = (user: UserInstance): string => {
    const expiresIn = 60 * 60 * 24 
    const payload = {
      id: user.id,
      email: user.email,
      user: `${user.firstName} ${user.lastName}`,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    }
    const accessToken = jwt.sign(payload, config.SECRET_KEY as Secret);
    return accessToken;
  };