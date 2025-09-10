// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the Next.js request environment
global.Headers = class Headers {
  constructor(init = {}) {
    this.headers = new Map();
    if (init) {
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