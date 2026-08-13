import assert from "node:assert/strict";
import test from "node:test";
import { formatDocumentNumber, getPaymentAccountType } from "../src/lib/sales";

test("formatDocumentNumber pads monotonically allocated sequences", () => {
  assert.equal(formatDocumentNumber("INV", 1), "INV-00001");
  assert.equal(formatDocumentNumber("TSM", 123456), "TSM-123456");
});

test("payment methods map to configured financial account types", () => {
  assert.equal(getPaymentAccountType("CASH"), "CASH");
  assert.equal(getPaymentAccountType("BANK"), "BANK");
  assert.equal(getPaymentAccountType("CARD"), "CARD");
});
