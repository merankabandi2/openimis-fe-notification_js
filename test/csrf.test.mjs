import test from 'node:test';
import assert from 'node:assert/strict';

import { csrfToken, withCsrf } from '../src/csrf.js';
import { fetchNotifications, markAsRead, markAllAsRead, updatePreferences } from '../src/actions.js';

const withCookie = (cookie, run) => {
  globalThis.document = { cookie };
  try {
    return run();
  } finally {
    delete globalThis.document;
  }
};

// Runs a thunk with a recording global fetch and returns the request it sent.
const sentRequest = async (thunk) => {
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { json: async () => ({}) };
  };
  try {
    await thunk(() => undefined);
  } finally {
    globalThis.fetch = original;
  }
  assert.equal(calls.length, 1);
  return calls[0];
};

test('the token is the live csrftoken cookie', () => {
  withCookie('theme=dark; csrftoken=abc123; lang=fr', () => assert.equal(csrfToken(), 'abc123'));
});

test('a cookie that only ends in csrftoken is not the token', () => {
  withCookie('xcsrftoken=nope', () => assert.notEqual(csrfToken(), 'nope'));
});

test('without a cookie the token fe-core stored at login is used', () => {
  globalThis.__localStorage = { csrfToken: 'stored' };
  try {
    withCookie('theme=dark', () => assert.equal(csrfToken(), 'stored'));
  } finally {
    delete globalThis.__localStorage;
  }
});

test('withCsrf keeps the given headers and adds the token header', () => {
  withCookie('csrftoken=abc123', () => {
    assert.deepEqual(withCsrf({ Accept: 'application/json' }), {
      Accept: 'application/json',
      'X-CSRFToken': 'abc123',
    });
  });
});

test('marking one notification as read sends the token with the PATCH', async () => {
  const { url, options } = await withCookie('csrftoken=abc123', () => sentRequest(markAsRead('n1')));
  assert.equal(url, '/api/notification/n1/read/');
  assert.equal(options.method, 'PATCH');
  assert.equal(options.headers['X-CSRFToken'], 'abc123');
  assert.equal(options.headers['Content-Type'], 'application/json');
});

test('marking all notifications as read sends the token with the PATCH', async () => {
  const { url, options } = await withCookie('csrftoken=abc123', () => sentRequest(markAllAsRead()));
  assert.equal(url, '/api/notification/read_all/');
  assert.equal(options.method, 'PATCH');
  assert.equal(options.headers['X-CSRFToken'], 'abc123');
});

test('updating the preferences sends the token with the PUT and keeps the body', async () => {
  const { url, options } = await withCookie('csrftoken=abc123', () => sentRequest(updatePreferences({ email: true })));
  assert.equal(url, '/api/notification/preferences/update/');
  assert.equal(options.method, 'PUT');
  assert.equal(options.headers['X-CSRFToken'], 'abc123');
  assert.equal(options.body, JSON.stringify({ email: true }));
});

test('listing notifications stays a GET without the token header', async () => {
  const { options } = await withCookie('csrftoken=abc123', () => sentRequest(fetchNotifications()));
  assert.equal(options.method, undefined);
  assert.equal(options.headers['X-CSRFToken'], undefined);
});
