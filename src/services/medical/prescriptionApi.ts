import { Platform } from 'react-native';

import { medicalConfig } from '@/constants/medicalConfig';

import type { DocumentAnalysis, PickedDocument, PrescriptionReport } from './medical.types';

/**
 * A failed upload. `status` is the HTTP status, or 0 when the workflow couldn't be reached
 * (offline, or no answer in time); `message` is the workflow's own wording when it sent one.
 */
export class PrescriptionApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'PrescriptionApiError';
  }
}

/** Keys n8n workflows commonly answer with, most specific first. */
const TEXT_KEYS = ['text', 'extractedText', 'extracted_text', 'analysis', 'output', 'result', 'content'];

/**
 * The text in a workflow's answer, whatever shape the Respond node gave it: plain text, a
 * string, `{ text }` (or another common key), an OpenAI-style `message.content`, or a list of
 * items (n8n's "all incoming items"), whose texts are joined.
 */
export function extractText(data: unknown): string | null {
  if (typeof data === 'string') return data.trim() || null;
  if (Array.isArray(data)) {
    const parts = data.map(extractText).filter((part): part is string => !!part);
    return parts.length ? parts.join('\n\n') : null;
  }
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    for (const key of TEXT_KEYS) {
      const text = extractText(record[key]);
      if (text) return text;
    }
    if (record.message && typeof record.message === 'object') return extractText(record.message);
    if (record.json && typeof record.json === 'object') return extractText(record.json);
  }
  return null;
}

/** The workflow's report, if the answer is one (an object, or n8n's list of one item). */
function asReport(data: unknown): PrescriptionReport | null {
  const item = Array.isArray(data) ? data[0] : data;
  if (!item || typeof item !== 'object') return null;
  const record = item as Partial<PrescriptionReport>;
  if (!('medications' in record) && !('diagnosis' in record) && !('lab_results' in record)) {
    return null;
  }
  return {
    doctor: record.doctor ?? { name: null },
    facility: record.facility ?? { name: null },
    diagnosis: record.diagnosis ?? null,
    medications: Array.isArray(record.medications) ? record.medications : [],
    lab_results: Array.isArray(record.lab_results) ? record.lab_results : [],
    scan_report: record.scan_report ?? null,
    confidence: record.confidence ?? { overall: null },
  };
}

/** The file part of the form: the File on web; on native, RN's `{ uri, name, type }`. */
function filePart(document: PickedDocument): Blob {
  if (Platform.OS === 'web' && document.file) return document.file;
  // React Native's FormData reads the file from `uri`; the DOM typing has no shape for it.
  return { uri: document.uri, name: document.name, type: document.mimeType } as unknown as Blob;
}

/**
 * Sends a document to the n8n workflow and returns what it read: the workflow's structured
 * report (doctor, diagnosis, medications, lab results, scan report), or plain text. `type`
 * tells the workflow what the resident said the document is (prescription, X-ray, lab result).
 */
export async function analyzeDocument(
  document: PickedDocument,
  type: string,
): Promise<DocumentAnalysis> {
  const form = new FormData();
  form.append(medicalConfig.fileField, filePart(document), document.name);
  form.append('type', type);
  form.append('fileName', document.name);
  form.append('mimeType', document.mimeType);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), medicalConfig.requestTimeoutMs);
  let response: Response;
  try {
    // No Content-Type: fetch sets multipart/form-data with its boundary.
    response = await fetch(medicalConfig.webhookUrl, {
      method: 'POST',
      headers: { Accept: 'application/json, text/plain' },
      body: form,
      signal: controller.signal,
    });
  } catch {
    throw new PrescriptionApiError(0, 'Cannot reach the document reader.');
  } finally {
    clearTimeout(timer);
  }

  const body = await response.text();
  let data: unknown = body;
  try {
    data = body ? JSON.parse(body) : '';
  } catch {
    // Plain text answer: keep it as is.
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && typeof (data as { message?: unknown }).message === 'string'
        ? (data as { message: string }).message
        : `Request failed (${response.status})`;
    throw new PrescriptionApiError(response.status, message);
  }

  const report = asReport(data);
  if (report) {
    // The workflow's own signal that Gemini's answer wasn't valid JSON.
    if (report.doctor.name === 'JSON ERROR') {
      throw new PrescriptionApiError(response.status, 'The document could not be read clearly.');
    }
    return { kind: 'report', report };
  }
  const text = extractText(data);
  if (!text) {
    throw new PrescriptionApiError(response.status, 'The document reader returned no text.');
  }
  return { kind: 'text', text };
}
