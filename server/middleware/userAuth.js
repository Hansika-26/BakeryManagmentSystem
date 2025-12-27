import { verifyJWT } from "../Utils/tokenUtils.js";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";

export const authenticateUser = (req, res, next) => {
  // console.log("authenticating user");
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("authentication Invalid");

  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };

    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication Invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log("Authorize roles required:", roles);
    console.log("User role:", req.user?.role);

    if (!req.user) {
      throw new UnauthorizedError("No user info found in request");
    }

    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Not authorized to access this route");
    }
    next();
  };
};

export default authenticateUser;