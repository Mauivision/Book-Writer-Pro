// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { webcrypto, randomUUID } from 'crypto';

const cryptoRef = globalThis.crypto ?? webcrypto;
if (typeof cryptoRef.randomUUID !== 'function') {
  cryptoRef.randomUUID = randomUUID;
}
if (!globalThis.crypto) {
  globalThis.crypto = cryptoRef;
}
