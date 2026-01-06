import '@testing-library/jest-dom';

// Add any other global test setup here

// Mock the global fetch API to prevent "fetch is not defined" errors in JSDOM
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  } as Response)
);
