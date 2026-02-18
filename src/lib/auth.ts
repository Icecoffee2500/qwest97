import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "dev-fallback-secret-replace-in-production"
  );
}

export async function createSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string) {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
