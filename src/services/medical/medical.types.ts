/** A file the resident picked, ready to send (from expo-document-picker). */
export interface PickedDocument {
  uri: string;
  name: string;
  mimeType: string;
  /** Web only: the browser's File, which FormData sends as is. */
  file?: File;
}

export interface PrescribedMedication {
  name: string | null;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
}

export interface LabResult {
  test: string | null;
  value: string | null;
  unit: string | null;
  reference_range: string | null;
  flag: 'high' | 'low' | 'normal' | null;
}

/**
 * What the n8n workflow ("Handwritten Medical Prescription Digitization and Analysis") reads
 * from a document: Gemini's answer, normalised by its "Clean JSON Output" node. Fields the
 * document doesn't have are null or empty.
 */
export interface PrescriptionReport {
  doctor: { name: string | null };
  facility: { name: string | null };
  diagnosis: string | null;
  medications: PrescribedMedication[];
  lab_results: LabResult[];
  scan_report: { type: string | null; findings: string | null; impression: string | null } | null;
  /** 0–1. */
  confidence: { overall: number | null };
}

/** The workflow's reading: its structured report, or plain text from a simpler workflow. */
export type DocumentAnalysis =
  | { kind: 'report'; report: PrescriptionReport }
  | { kind: 'text'; text: string };
