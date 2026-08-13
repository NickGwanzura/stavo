import assert from "node:assert/strict";
import test from "node:test";
import { validateIMEI } from "../src/lib/imei";

test("IMEI validation accepts a valid Luhn value", () => {
  assert.equal(validateIMEI("490154203237518"), true);
});

test("IMEI validation rejects malformed or invalid values", () => {
  assert.equal(validateIMEI("490154203237519"), false);
  assert.equal(validateIMEI("123"), false);
});
