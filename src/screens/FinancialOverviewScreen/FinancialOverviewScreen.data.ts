import type { Glyph } from '@/components/common/AppIcon';
import type { Locale, Localized } from '@/context/LocaleContext';
import { formatDate } from '@/utils/date';

/**
 * Financial Overview (Assets/screens/financial overview 1.png and 2.png): the unit's price and
 * what has been paid, its instalments, maintenance fees and payment schedule. The figures are
 * the design's sample data, shaped like an API response so a backend can replace this module
 * rather than the screen. Amounts are in Omani rials.
 */

export interface UnitFinance {
  unitName: string;
  usage: Localized<string>;
  building: Localized<string>;
  price: number;
  paid: number;
  installments: { total: number; paid: number };
  nextInstallment: { amount: number; due: string };
  maintenance: { annualFee: number; paid: number; outstanding: number; nextDue: string };
}

export const unitFinance: UnitFinance = {
  unitName: 'A-304',
  usage: { en: 'Residential', ar: 'سكني' },
  building: { en: 'Building A', ar: 'المبنى A' },
  price: 95_000,
  paid: 59_000,
  installments: { total: 36, paid: 24 },
  nextInstallment: { amount: 1_500, due: '2026-11-15' },
  maintenance: { annualFee: 200, paid: 4_000, outstanding: 6_000, nextDue: '2026-11-15' },
};

export type PaymentKind = 'installment' | 'maintenance';

export interface PaymentRecord {
  id: string;
  kind: PaymentKind;
  date: string;
  amount: number;
}

/** Newest first. The first three are the design's; "View All" shows the rest. */
export const paymentSchedule: readonly PaymentRecord[] = [
  { id: 'p-2026-10', kind: 'installment', date: '2026-10-15', amount: 1_500 },
  { id: 'p-2026-09', kind: 'installment', date: '2026-09-15', amount: 1_500 },
  { id: 'p-2026-08', kind: 'installment', date: '2026-08-15', amount: 1_500 },
  { id: 'p-2026-07', kind: 'installment', date: '2026-07-15', amount: 1_500 },
  { id: 'p-2026-06', kind: 'installment', date: '2026-06-15', amount: 1_500 },
  { id: 'p-2026-05', kind: 'installment', date: '2026-05-15', amount: 1_500 },
];

/** Payments listed before "View All". */
export const SCHEDULE_PREVIEW = 3;

export const financeContent: Localized<{
  overline: string;
  title: string;
  myUnit: string;
  unitPrice: string;
  paid: string;
  remaining: string;
  totalPaid: string;
  remainingAmount: string;
  installmentOverview: string;
  totalInstallments: string;
  paidInstallments: string;
  remainingInstallments: string;
  nextInstallment: string;
  dueDate: string;
  payNow: string;
  maintenanceFees: string;
  annualFee: string;
  outstanding: string;
  nextDue: string;
  paymentSchedule: string;
  viewAll: string;
  showLess: string;
  paidKind: Record<PaymentKind, string>;
  downloadStatement: string;
  contract: string;
  currency: string;
  statementFailedTitle: string;
  statementFailedBody: string;
  paidOf: (percent: string) => string;
}> = {
  en: {
    overline: 'PAYMENTS',
    title: 'Financial Overview',
    myUnit: 'My Unit',
    unitPrice: 'Unit Price',
    paid: 'Paid',
    remaining: 'Remaining',
    totalPaid: 'Total Paid',
    remainingAmount: 'Remaining Amount',
    installmentOverview: 'Installment Overview',
    totalInstallments: 'Total installment',
    paidInstallments: 'Paid',
    remainingInstallments: 'Remaining',
    nextInstallment: 'Next Installment',
    dueDate: 'Due Date :',
    payNow: 'PAY NOW',
    maintenanceFees: 'Maintenance Fees',
    annualFee: 'Annual Fee',
    outstanding: 'Outstanding',
    nextDue: 'Next Due :',
    paymentSchedule: 'Payment schedule',
    viewAll: 'View ALL',
    showLess: 'Show less',
    paidKind: { installment: 'Installment Paid', maintenance: 'Maintenance Paid' },
    downloadStatement: 'Download Statement',
    contract: 'Contract',
    currency: 'OMR',
    statementFailedTitle: 'Statement not saved',
    statementFailedBody: 'The statement could not be created on this device. Please try again.',
    paidOf: (percent) => `${percent} paid`,
  },
  ar: {
    overline: 'المدفوعات',
    title: 'النظرة المالية',
    myUnit: 'وحدتي',
    unitPrice: 'سعر الوحدة',
    paid: 'المدفوع',
    remaining: 'المتبقي',
    totalPaid: 'إجمالي المدفوع',
    remainingAmount: 'المبلغ المتبقي',
    installmentOverview: 'ملخص الأقساط',
    totalInstallments: 'إجمالي الأقساط',
    paidInstallments: 'المدفوعة',
    remainingInstallments: 'المتبقية',
    nextInstallment: 'القسط التالي',
    dueDate: 'تاريخ الاستحقاق:',
    payNow: 'ادفع الآن',
    maintenanceFees: 'رسوم الصيانة',
    annualFee: 'الرسوم السنوية',
    outstanding: 'المستحق',
    nextDue: 'الاستحقاق التالي:',
    paymentSchedule: 'جدول المدفوعات',
    viewAll: 'عرض الكل',
    showLess: 'عرض أقل',
    paidKind: { installment: 'تم دفع القسط', maintenance: 'تم دفع رسوم الصيانة' },
    downloadStatement: 'تنزيل كشف الحساب',
    contract: 'العقد',
    currency: 'ر.ع.',
    statementFailedTitle: 'لم يُحفظ الكشف',
    statementFailedBody: 'تعذّر إنشاء كشف الحساب على هذا الجهاز. حاول مرة أخرى.',
    paidOf: (percent) => `مدفوع ${percent}`,
  },
};

/** "95,000": grouped with Western digits, as amounts are shown across the app. */
export function formatAmount(value: number): string {
  return value.toLocaleString('en-US');
}

/** "15 NOV 2026" (the design's capitals) / "15 نوفمبر 2026". */
export function formatDueDate(iso: string, locale: Locale): string {
  const text = formatDate(iso, locale);
  return locale === 'en' ? text.toUpperCase() : text;
}

/** The paid share of the price, 0–1. */
export function paidShare(finance: UnitFinance): number {
  return finance.price > 0 ? finance.paid / finance.price : 0;
}

/** The section icons, drawn gold as in the design. */
export const financeIcons = {
  unit: { set: 'material', name: 'home' },
  price: { set: 'material', name: 'database' },
  totalPaid: { set: 'material', name: 'wallet' },
  remaining: { set: 'material', name: 'file-document' },
  installments: { set: 'material', name: 'calendar-month' },
  nextInstallment: { set: 'material', name: 'database' },
  dueDate: { set: 'material', name: 'calendar-month' },
  maintenance: { set: 'material', name: 'cog' },
  schedule: { set: 'material', name: 'calendar-clock' },
  statement: { set: 'material', name: 'file-document' },
  contract: { set: 'material', name: 'receipt' },
} as const satisfies Record<string, Glyph>;
