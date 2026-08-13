import assert from "node:assert/strict";
import test from "node:test";
import { secureEqual } from "../src/lib/security";

test("secureEqual accepts identical secrets", () => {
  assert.equal(secureEqual("a-secure-token", "a-secure-token"), true);
});

test("secureEqual rejects mismatched values and lengths", () => {
  assert.equal(secureEqual("a-secure-token", "a-secure-taken"), false);
  assert.equal(secureEqual("short", "a-much-longer-token"), false);
});
