import SHA256 from "crypto-js/sha256";
import { compactDecrypt } from "jose";

export function encryptSHA(item: string) {
  const encrypted = SHA256(item).toString();
  return encrypted;
}

export async function decryptJWT(secretKey: string, token: string) {
  try {
    const secretHash = encryptSHA(secretKey);
    const secretBytes = Buffer.from(secretHash, "hex");

    const buffer = Buffer.from(secretBytes);
    const { plaintext } = await compactDecrypt(token, buffer);
    const payload = new TextDecoder().decode(plaintext);
    console.log("payload:", payload);
    return JSON.parse(payload);
  } catch (error) {
    console.error("Error decrypting token:", error);
    return null;
  }
}
