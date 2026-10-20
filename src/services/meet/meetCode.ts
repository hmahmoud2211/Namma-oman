import { meetConfig } from '@/constants/meetConfig';

/** Codes use 32 symbols: no 0/O or 1/I, so they survive being read aloud. */
const NOT_IN_ALPHABET = /[^A-HJ-NP-Z2-9]/g;

/** The canonical code (upper case, no dashes) from whatever was typed or pasted. */
export function normalizeMeetCode(input: string) {
  return input.toUpperCase().replace(NOT_IN_ALPHABET, '').slice(0, meetConfig.codeLength);
}

/** `ABCD-EFGH-JKLM`, also while it's still being typed. */
export function formatMeetCode(input: string) {
  const group = meetConfig.codeGroup;
  return normalizeMeetCode(input).replace(new RegExp(`(.{${group}})(?=.)`, 'g'), '$1-');
}

export function isCompleteMeetCode(input: string) {
  return normalizeMeetCode(input).length === meetConfig.codeLength;
}

/**
 * Pulls a code out of a pasted invite: a join link (`…?call=CODE`) or the bare code.
 * Returns the canonical code, or the input as typed when it holds no link.
 */
export function codeFromInvite(input: string) {
  const match = /[?&]call=([A-Za-z0-9-]+)/.exec(input);
  return match ? normalizeMeetCode(match[1]) : input;
}
