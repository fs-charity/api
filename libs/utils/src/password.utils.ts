import * as crypto from 'crypto';

export function hashPassword(rawPassword: string) {
  return crypto
    .createHash('sha1')
    .update(rawPassword)
    .digest()
    .toString('base64');
}

export function comparePassword(
  rawPassword: string,
  hashedPassword: string,
): boolean {
  return hashedPassword == hashPassword(rawPassword);
}
