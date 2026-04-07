// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { webcrypto } from 'crypto';

if (
  typeof globalThis.crypto === 'undefined' ||
  typeof globalThis.crypto.randomUUID !== 'function'
) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
    writable: true,
  });
}

// Only polyfill Headers when missing (do not replace Node/jsdom native Headers — NextRequest needs a full implementation)
if (typeof globalThis.Headers === 'undefined') {
  globalThis.Headers = class Headers {
    constructor(init = {}) {
      this.headers = new Map();
      if (init && typeof init === 'object' && !Array.isArray(init)) {
        Object.entries(init).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value);
        });
      }
    }

    append(name, value) {
      const key = name.toLowerCase();
      const existing = this.headers.get(key);
      if (existing) {
        this.headers.set(key, `${existing}, ${value}`);
      } else {
        this.headers.set(key, value);
      }
    }

    set(name, value) {
      this.headers.set(name.toLowerCase(), value);
    }

    get(name) {
      return this.headers.get(name.toLowerCase()) || null;
    }

    has(name) {
      return this.headers.has(name.toLowerCase());
    }

    delete(name) {
      this.headers.delete(name.toLowerCase());
    }

    forEach(callback) {
      this.headers.forEach((value, key) => callback(value, key));
    }
  };
}
