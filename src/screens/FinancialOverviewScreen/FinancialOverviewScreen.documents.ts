import { commonStrings } from '@/constants/strings';
import { resident } from '@/constants/resident';
import type { Locale, Localized } from '@/context/LocaleContext';
import { detailsTable, documentPage, section } from '@/services/documents/documentPage';
import type { PdfDocument } from '@/services/documents/pdf.types';
import { formatDate, toIsoDate } from '@/utils/date';

import {
  financeContent,
  formatAmount,
  formatDueDate,
  paidShare,
  type PaymentRecord,
  type UnitFinance,
} from './FinancialOverviewScreen.data';

const COPY: Localized<{
  title: string;
  summary: string;
  installments: string;
  maintenance: string;
  payments: string;
  unit: string;
  issued: (date: string) => string;
  note: string;
}> = {
  en: {
    title: 'Account Statement',
    summary: 'Unit price and payments',
    installments: 'Installments',
    maintenance: 'Maintenance fees',
    payments: 'Payment schedule',
    unit: 'Unit',
    issued: (date) => `Issued ${date}`,
    note: 'Generated in the Nama app from your account’s figures. For an official statement, contact Nama Real Estate.',
  },
  ar: {
    title: 'كشف الحساب',
    summary: 'سعر الوحدة والمدفوعات',
    installments: 'الأقساط',
    maintenance: 'رسوم الصيانة',
    payments: 'جدول المدفوعات',
    unit: 'الوحدة',
    issued: (date) => `صدر في ${date}`,
    note: 'أُنشئ في تطبيق نماء من أرقام حسابك. للحصول على كشف رسمي، تواصل مع نماء العقارية.',
  },
};

/** The statement behind "Download Statement": the screen's figures as a printable page. */
export function buildStatementDocument(
  finance: UnitFinance,
  payments: readonly PaymentRecord[],
  locale: Locale,
): PdfDocument {
  const copy = COPY[locale];
  const content = financeContent[locale];
  const money = (value: number) => `${formatAmount(value)} ${content.currency}`;
  const remaining = finance.price - finance.paid;
  const { total, paid } = finance.installments;
  const fees = finance.maintenance;

  const body = [
    section(
      copy.summary,
      detailsTable([
        [copy.unit, `${finance.unitName} · ${finance.usage[locale]} · ${finance.building[locale]}`],
        [content.unitPrice, money(finance.price)],
        [content.totalPaid, `${money(finance.paid)} (${Math.round(paidShare(finance) * 100)}%)`],
        [content.remainingAmount, money(remaining)],
      ]),
    ),
    section(
      copy.installments,
      detailsTable([
        [content.totalInstallments, String(total)],
        [content.paidInstallments, String(paid)],
        [content.remainingInstallments, String(total - paid)],
        [content.nextInstallment, `${money(finance.nextInstallment.amount)} · ${formatDueDate(finance.nextInstallment.due, locale)}`],
      ]),
    ),
    section(
      copy.maintenance,
      detailsTable([
        [content.annualFee, money(fees.annualFee)],
        [content.paid, money(fees.paid)],
        [content.outstanding, money(fees.outstanding)],
        [content.nextDue, formatDueDate(fees.nextDue, locale)],
      ]),
    ),
    section(
      copy.payments,
      detailsTable(payments.map((payment) => [`${content.paidKind[payment.kind]} · ${formatDueDate(payment.date, locale)}`, money(payment.amount)])),
    ),
  ].join('');

  return {
    title: copy.title,
    fileName: `Statement-${finance.unitName}`,
    html: documentPage({
      title: copy.title,
      pageTitle: `${copy.title} - ${finance.unitName}`,
      meta: [`${resident.name[locale]} · ${resident.unit[locale]}`, copy.issued(formatDate(toIsoDate(new Date()), locale))],
      body,
      note: copy.note,
      brand: commonStrings[locale].brandName,
      lang: locale,
    }),
  };
}
