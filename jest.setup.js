// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { webcrypto, randomUUID } from 'crypto';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

if (!global.crypto) {
  global.crypto = webcrypto;
} else {
  if (!global.crypto.subtle) {
    global.crypto.subtle = webcrypto.subtle;
  }
  if (!global.crypto.randomUUID) {
    global.crypto.randomUUID = randomUUID;
  }
} 