/**
 * The n8n workflow that reads an uploaded medical document and answers with its text
 * (Medical screen). Override the webhook per build with EXPO_PUBLIC_PRESCRIPTION_WEBHOOK_URL
 * (see .env.example), e.g. n8n's `/webhook-test/...` address while editing the workflow.
 *
 * The webhook allows browser origins (CORS), so web builds call it directly, like native ones.
 */
const DEFAULT_WEBHOOK_URL = 'https://emscompany2016.app.n8n.cloud/webhook/prescription-analysis';

export const medicalConfig = {
  webhookUrl: process.env.EXPO_PUBLIC_PRESCRIPTION_WEBHOOK_URL || DEFAULT_WEBHOOK_URL,
  /**
   * The multipart field carrying the file: the Webhook node's binary property. n8n names a
   * multipart upload after its field, and `data` is the name its nodes read by default.
   */
  fileField: process.env.EXPO_PUBLIC_PRESCRIPTION_FILE_FIELD || 'data',
  /** Reading a document runs OCR / a model in the workflow, so allow it time. */
  requestTimeoutMs: 120_000,
  /** What the picker offers: photos and scans of documents. */
  acceptedTypes: ['image/*', 'application/pdf'],
} as const;
