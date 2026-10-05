/** Safe application errors; provider payloads and stack traces never become UI messages. */
export class ReceiptExtractionError extends Error {
  code: string;
  constructor(code: string, message: string) { super(message); this.name = 'ReceiptExtractionError'; this.code = code; }
}
