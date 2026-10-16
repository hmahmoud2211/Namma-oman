import { commonStrings } from '@/constants/strings';
import { resident } from '@/constants/resident';
import type { Locale, Localized } from '@/context/LocaleContext';
import { detailsTable, documentPage, escapeHtml, section } from '@/services/documents/documentPage';
import type { PdfDocument } from '@/services/documents/pdf.types';
import { qrSvg } from '@/services/documents/qrSvg';
import { darkColors } from '@/theme/colors';
import { formatDate, formatDay, formatTime, toIsoDate } from '@/utils/date';

import {
  guestsLabel,
  passPayload,
  statusDisplay,
  visitorContent,
  type VisitorPass,
} from './VisitorAccessScreen.data';

/** Large enough to scan from a phone held at the gate. */
const QR_SIZE = 220;

const COPY: Localized<{
  title: string;
  visit: string;
  visitor: string;
  mobile: string;
  date: string;
  time: string;
  guests: string;
  status: string;
  plate: string;
  hostedBy: (host: string, unit: string) => string;
  issued: (date: string) => string;
  note: string;
}> = {
  en: {
    title: 'Visitor Pass',
    visit: 'Visit',
    visitor: 'Visitor',
    mobile: 'Mobile',
    date: 'Visit Date',
    time: 'Arrival Time',
    guests: 'Guests',
    status: 'Status',
    plate: 'Car Plate',
    hostedBy: (host, unit) => `Hosted by ${host} · ${unit}`,
    issued: (date) => `Issued ${date}`,
    note: 'Generated in the Nama app. Valid only for the visit above.',
  },
  ar: {
    title: 'تصريح زائر',
    visit: 'الزيارة',
    visitor: 'الزائر',
    mobile: 'الهاتف',
    date: 'تاريخ الزيارة',
    time: 'وقت الوصول',
    guests: 'الضيوف',
    status: 'الحالة',
    plate: 'رقم اللوحة',
    hostedBy: (host, unit) => `المضيف: ${host} · ${unit}`,
    issued: (date) => `صدر في ${date}`,
    note: 'أُنشئ في تطبيق نماء. صالح للزيارة المذكورة أعلاه فقط.',
  },
};

/**
 * The pass the resident sends their visitor: a QR carrying the same payload as the card's
 * (so the gate reads either), at a sturdier error-correction level for a code shown on
 * another phone or printed, with the visit details under it.
 */
export function buildPassDocument(pass: VisitorPass, locale: Locale): PdfDocument {
  const copy = COPY[locale];
  const name = pass.name[locale];
  const details: (readonly [string, string])[] = [
    [copy.visitor, name],
    [copy.mobile, pass.mobile],
    [copy.date, formatDay(pass.date, locale)],
    [copy.time, formatTime(pass.time, locale)],
    [copy.guests, guestsLabel(pass.guests, locale)],
    [copy.status, statusDisplay[pass.status].label[locale]],
    ...(pass.plate ? [[copy.plate, pass.plate] as const] : []),
  ];

  const body = [
    `<div class="qr">${qrSvg(passPayload(pass), QR_SIZE, darkColors.qrModule)}</div>`,
    `<p class="qr-caption">${escapeHtml(visitorContent[locale].passCaption)}</p>`,
    section(copy.visit, detailsTable(details)),
  ].join('');

  return {
    title: copy.title,
    fileName: `Visitor-Pass-${pass.name.en.trim().replace(/[^A-Za-z0-9]+/g, '-') || pass.id}`,
    html: documentPage({
      title: copy.title,
      pageTitle: `${copy.title} - ${name}`,
      meta: [
        copy.hostedBy(resident.name[locale], resident.unit[locale]),
        copy.issued(formatDate(toIsoDate(new Date()), locale)),
      ],
      body,
      note: copy.note,
      brand: commonStrings[locale].brandName,
      lang: locale,
    }),
  };
}
