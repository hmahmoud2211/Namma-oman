import { images, type AppImageSource } from '@/constants/images';
import type { Locale, Localized } from '@/context/LocaleContext';
import type {
  DocumentAnalysis,
  PickedDocument,
  PrescriptionReport,
} from '@/services/medical/medical.types';
import type { ParamlessRoute } from '@/types/navigation.types';

/**
 * Copy as shown in the Medical Figma export. Two typos there are corrected ("Trak", "Chest-
 * X-Rays"). Uploads are sent to the n8n document reader (services/medical); the files listed
 * at first are the design's samples, as there is no service yet that lists past uploads.
 */
export const medicalContent: Localized<{
  overline: string;
  title: string;
  categories: readonly string[];
  body: string;
  uploadTitle: string;
  uploadFiles: string;
  filesTitle: string;
  filesUploaded: (count: number) => string;
  noFiles: string;
  fileOptions: string;
  viewFile: string;
  deleteFile: string;
  fileDeleted: string;
  uploadedLabel: string;
  chooseType: string;
  reading: string;
  readDone: string;
  readFailed: string;
  readFailedBody: string;
  retry: string;
  documentText: string;
  copyText: string;
  copied: string;
  sampleNoText: string;
  extentImage: string;
  extentPdf: string;
  extentFile: string;
}> = {
  en: {
    overline: 'Medical Service',
    title: 'Medical',
    categories: ['Prescriptions', 'X-Ray', 'Lab'],
    body: 'Upload documents and receive medication reminders',
    uploadTitle: 'Upload Medical Documents',
    uploadFiles: 'Upload Files',
    filesTitle: 'Your Files',
    filesUploaded: (count) => (count === 1 ? '1 File uploaded' : `${count} Files uploaded`),
    noFiles: 'No files uploaded yet.',
    fileOptions: 'File options',
    viewFile: 'View',
    deleteFile: 'Delete',
    fileDeleted: 'File deleted',
    uploadedLabel: 'Uploaded',
    chooseType: 'What are you uploading?',
    reading: 'Reading…',
    readDone: 'Document read',
    readFailed: 'Could not read the document',
    readFailedBody: 'Please try again.',
    retry: 'Try again',
    documentText: 'Document text',
    copyText: 'Copy text',
    copied: 'Copied',
    sampleNoText: 'This sample file has no text. Upload a document to read it.',
    extentImage: '1 image',
    extentPdf: 'PDF',
    extentFile: '1 file',
  },
  ar: {
    overline: 'خدمة طبية',
    title: 'الرعاية الطبية',
    categories: ['الوصفات', 'الأشعة', 'المختبر'],
    body: 'ارفع مستنداتك واستلم تذكيرات الأدوية',
    uploadTitle: 'رفع المستندات الطبية',
    uploadFiles: 'رفع الملفات',
    filesTitle: 'ملفاتك',
    filesUploaded: (count) => (count === 1 ? 'تم رفع ملف واحد' : `تم رفع ${count} ملفات`),
    noFiles: 'لم تُرفع أي ملفات بعد.',
    fileOptions: 'خيارات الملف',
    viewFile: 'عرض',
    deleteFile: 'حذف',
    fileDeleted: 'تم حذف الملف',
    uploadedLabel: 'تم الرفع',
    chooseType: 'ما نوع المستند؟',
    reading: 'جارٍ القراءة…',
    readDone: 'تمت قراءة المستند',
    readFailed: 'تعذّرت قراءة المستند',
    readFailedBody: 'يرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة',
    documentText: 'نص المستند',
    copyText: 'نسخ النص',
    copied: 'تم النسخ',
    sampleNoText: 'هذا ملف تجريبي بلا نص. ارفع مستنداً لقراءته.',
    extentImage: 'صورة واحدة',
    extentPdf: 'PDF',
    extentFile: 'ملف واحد',
  },
};

/** Between the hero's categories ("Prescriptions•X-Ray•Lab"). */
export const CATEGORY_SEPARATOR = '•';

export type MedicalDocumentType = 'prescription' | 'xray' | 'lab';

export interface UploadCategory {
  id: MedicalDocumentType;
  label: Localized<string>;
  image: number;
  /** The cut-out's size in design dp (each includes its own soft margin). */
  imageSize: { width: number; height: number };
}

/** The three upload tiles, in reading order. */
export const uploadCategories: readonly UploadCategory[] = [
  {
    id: 'prescription',
    label: { en: 'Prescriptions', ar: 'الوصفات الطبية' },
    image: images.medicalUploadPrescription,
    imageSize: { width: 45.4, height: 45.4 },
  },
  {
    id: 'xray',
    label: { en: 'X-Rays', ar: 'الأشعة' },
    image: images.medicalUploadXray,
    imageSize: { width: 53, height: 49.2 },
  },
  {
    id: 'lab',
    label: { en: 'Lab Results', ar: 'نتائج المختبر' },
    image: images.medicalUploadLab,
    imageSize: { width: 47.3, height: 45.4 },
  },
];

/** `reading` while the workflow reads the upload; `failed` keeps it for "Try again". */
export type MedicalFileStatus = 'reading' | 'read' | 'failed';

export interface MedicalFile {
  id: string;
  type: MedicalDocumentType;
  name: Localized<string>;
  /** Pages or images in the upload. */
  extent: Localized<string>;
  /** Left out for a PDF, which shows a document glyph. */
  thumbnail?: AppImageSource;
  status: MedicalFileStatus;
  /** What the workflow read; the samples have none. */
  analysis?: DocumentAnalysis;
  /** The picked file, kept to send again after a failure. */
  document?: PickedDocument;
}

export const sampleFiles: readonly MedicalFile[] = [
  {
    id: 'prescription-1',
    type: 'prescription',
    name: { en: 'Prescriptions', ar: 'الوصفات الطبية' },
    extent: { en: '1 Page', ar: 'صفحة واحدة' },
    thumbnail: images.medicalFilePrescription,
    status: 'read',
  },
  {
    id: 'xray-1',
    type: 'xray',
    name: { en: 'Chest X-Rays', ar: 'أشعة الصدر' },
    extent: { en: '1 image', ar: 'صورة واحدة' },
    thumbnail: images.medicalFileXray,
    status: 'read',
  },
  {
    id: 'lab-1',
    type: 'lab',
    name: { en: 'Lab Results', ar: 'نتائج المختبر' },
    extent: { en: '2 Pages', ar: 'صفحتان' },
    thumbnail: images.medicalFileLab,
    status: 'read',
  },
];

export interface MedicalShortcut {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  image: number;
  /** Screen the card opens; cards without one show the "under development" notice. */
  route?: ParamlessRoute;
}

/** The 2×2 shortcut cards under the files, in reading order. */
export const medicalShortcuts: readonly MedicalShortcut[] = [
  {
    id: 'prescriptions',
    title: { en: 'Prescriptions', ar: 'الوصفات الطبية' },
    description: { en: 'View & manage\nyour schedule', ar: 'اعرض جدولك\nوأدِره' },
    image: images.medicalCardPrescriptions,
    route: 'MedicationSchedule',
  },
  {
    id: 'treatment-progress',
    title: { en: 'Treatment Progress', ar: 'تقدّم العلاج' },
    description: { en: 'Track your health\nimprovements', ar: 'تابع تحسّن\nحالتك الصحية' },
    image: images.medicalCardProgress,
  },
  {
    id: 'medical-records',
    title: { en: 'Medical Records', ar: 'السجلات الطبية' },
    description: {
      en: 'All Prescriptions,\nScans And Labs',
      ar: 'كل الوصفات\nوالأشعة والتحاليل',
    },
    image: images.medicalCardRecords,
  },
  {
    id: 'appointments',
    title: { en: 'Appointments', ar: 'المواعيد' },
    description: { en: 'Upcoming Visits\nand Follow-Ups', ar: 'الزيارات القادمة\nوالمتابعات' },
    image: images.medicalCardAppointments,
  },
];

/** A just-picked document as a file card, before the workflow has read it. */
export function createUpload(
  document: PickedDocument,
  type: MedicalDocumentType,
  copy: Localized<{ extentImage: string; extentPdf: string; extentFile: string }>,
): MedicalFile {
  const isImage = document.mimeType.startsWith('image/');
  const extentKey = isImage
    ? 'extentImage'
    : document.mimeType === 'application/pdf'
      ? 'extentPdf'
      : 'extentFile';
  return {
    id: `upload-${Date.now()}`,
    type,
    name: { en: document.name, ar: document.name },
    extent: { en: copy.en[extentKey], ar: copy.ar[extentKey] },
    thumbnail: isImage ? { uri: document.uri } : undefined,
    status: 'reading',
    document,
  };
}

const REPORT_LABELS: Localized<{
  doctor: string;
  facility: string;
  diagnosis: string;
  medications: string;
  labResults: string;
  scanReport: string;
  scanType: string;
  findings: string;
  impression: string;
  confidence: string;
  flags: Record<'high' | 'low' | 'normal', string>;
  nothingFound: string;
}> = {
  en: {
    doctor: 'Doctor',
    facility: 'Facility',
    diagnosis: 'Diagnosis',
    medications: 'Medications',
    labResults: 'Lab results',
    scanReport: 'Scan report',
    scanType: 'Type',
    findings: 'Findings',
    impression: 'Impression',
    confidence: 'Reading confidence',
    flags: { high: 'High', low: 'Low', normal: 'Normal' },
    nothingFound: 'Nothing could be read from this document.',
  },
  ar: {
    doctor: 'الطبيب',
    facility: 'المنشأة',
    diagnosis: 'التشخيص',
    medications: 'الأدوية',
    labResults: 'نتائج المختبر',
    scanReport: 'تقرير الأشعة',
    scanType: 'النوع',
    findings: 'النتائج',
    impression: 'الانطباع',
    confidence: 'دقة القراءة',
    flags: { high: 'مرتفع', low: 'منخفض', normal: 'طبيعي' },
    nothingFound: 'تعذّرت قراءة أي محتوى من هذا المستند.',
  },
};

/** Joins the parts that are present, e.g. dose, frequency and duration. */
function joinPresent(parts: readonly (string | null | undefined)[], separator = ', ') {
  return parts.filter((part) => part && part.trim()).join(separator);
}

/** The workflow's report as readable text, in the app's language, leaving out empty sections. */
export function formatReport(report: PrescriptionReport, locale: Locale): string {
  const l = REPORT_LABELS[locale];
  const sections: string[] = [];

  const header = [
    report.doctor.name && `${l.doctor}: ${report.doctor.name}`,
    report.facility.name && `${l.facility}: ${report.facility.name}`,
    report.diagnosis && `${l.diagnosis}: ${report.diagnosis}`,
  ].filter(Boolean);
  if (header.length) sections.push(header.join('\n'));

  const medications = report.medications
    .filter((medication) => medication.name)
    .map((medication) => {
      const details = joinPresent([medication.dose, medication.frequency, medication.duration]);
      return `• ${medication.name}${details ? ` — ${details}` : ''}`;
    });
  if (medications.length) sections.push([l.medications, ...medications].join('\n'));

  const labs = report.lab_results
    .filter((result) => result.test)
    .map((result) => {
      const value = joinPresent([result.value, result.unit], ' ');
      const range = result.reference_range ? ` (${result.reference_range})` : '';
      const flag = result.flag ? ` — ${l.flags[result.flag] ?? result.flag}` : '';
      return `• ${result.test}${value ? `: ${value}` : ''}${range}${flag}`;
    });
  if (labs.length) sections.push([l.labResults, ...labs].join('\n'));

  const scan = report.scan_report;
  if (scan && (scan.type || scan.findings || scan.impression)) {
    sections.push(
      [
        l.scanReport,
        scan.type && `${l.scanType}: ${scan.type}`,
        scan.findings && `${l.findings}: ${scan.findings}`,
        scan.impression && `${l.impression}: ${scan.impression}`,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  if (!sections.length) return l.nothingFound;
  const confidence = report.confidence.overall;
  if (typeof confidence === 'number') {
    sections.push(`${l.confidence}: ${Math.round(confidence * 100)}%`);
  }
  return sections.join('\n\n');
}

/** What the workflow read, as text to show and copy. */
export function analysisText(analysis: DocumentAnalysis, locale: Locale): string {
  return analysis.kind === 'report' ? formatReport(analysis.report, locale) : analysis.text;
}
