import SHA256 from "crypto-js/sha256";
import { CompactEncrypt, compactDecrypt } from "jose";

export function encryptSHA(item: string) {
  const encrypted = SHA256(item).toString();
  return encrypted;
}

export async function encryptJWT(secretKey: string, payload: any) {
  try {
    const secretHash = encryptSHA(secretKey);
    const secretBytes = Buffer.from(secretHash, "hex");

    const buffer = Buffer.from(secretBytes);
    const jwe = await new CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload)),
    )
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .encrypt(buffer);

    return jwe;
  } catch (error) {
    console.error("Error encrypting payload:", error);
    return null;
  }
}

export async function decryptJWT(secretKey: string, token: string) {
  try {
    const secretHash = encryptSHA(secretKey);
    const secretBytes = Buffer.from(secretHash, "hex");

    const buffer = Buffer.from(secretBytes);
    const { plaintext } = await compactDecrypt(token, buffer);
    const payload = new TextDecoder().decode(plaintext);
    console.log("payload:", payload);

    const encryptedTo = encryptJWT(secretKey, payload);
    console.log("encryptedTo:", encryptedTo);

    return JSON.parse(payload);
  } catch (error) {
    console.error("Error decrypting token:", error);
    return null;
  }
}
