import * as crypto from 'crypto';

export function hashString(rawString: string) {
  return crypto
    .createHash('sha1')
    .update(rawString)
    .digest()
    .toString('base64');
}

export function compareHashedString(
  originalString: string,
  hashedString: string,
): boolean {
  return hashedString == hashString(originalString);
}
