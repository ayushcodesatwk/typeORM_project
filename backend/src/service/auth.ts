import jwt from "jsonwebtoken";
const secret = "chickiwikichicki";

const maxAge = 60 * 60;

export function createToken({ id }: { id: number }) {
  return jwt.sign({ id }, secret, { expiresIn: maxAge });
}