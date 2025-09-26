const crypto = require('crypto');
const SECRET_KEY = process.env.SECRET || "12345678901234567890123456789012"; // 32 characters for AES-256

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString("hex") };
}

function decrypt(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};
// This service provides encryption and decryption functions using AES-256-CBC.
// The `encrypt` function takes a plaintext string and returns an encrypted string.
// The `decrypt` function takes an encrypted string and returns the original plaintext string.
// The secret key is defined as a 32-character string, which is required for AES-256 encryption.