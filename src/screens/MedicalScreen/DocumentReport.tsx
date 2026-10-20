import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/common/AppButton";
import { AppIcon, type Glyph } from "@/components/common/AppIcon";
import { AppText } from "@/components/common/AppText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusChip, type StatusTone } from "@/components/ui/StatusChip";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLocale } from "@/hooks/useLocale";
import { useResponsive } from "@/hooks/useResponsive";
import { useToast } from "@/hooks/useToast";
import type {
  DocumentAnalysis,
  LabResult,
  PrescribedMedication,
  PrescriptionReport,
} from "@/services/medical/medical.types";
import { makeStyles } from "@/utils/makeStyles";
import { copyText } from "@/utils/share";

import {
  analysisText,
  medicalContent,
  reportLabels,
} from "./MedicalScreen.data";

/**
 * Wraps text the workflow read (names, values, ranges) in a first-strong isolate, so English
 * values keep their order inside Arabic lines: "(13.0 - 17.0)" no longer reads backwards.
 */
function isolate(text: string) {
  return `⁨${text}⁩`;
}

/** Joins the parts that are present. */
function joinPresent(
  parts: readonly (string | null | undefined)[],
  separator: string,
) {
  return parts.filter((part) => part && part.trim()).join(separator);
}

const FLAG_TONE: Record<NonNullable<LabResult["flag"]>, StatusTone> = {
  high: "danger",
  low: "warning",
  normal: "positive",
};

/** What the workflow read from a document: its report laid out in sections, with "Copy text". */
export function DocumentReport({ analysis }: { analysis: DocumentAnalysis }) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { showToast } = useToast();
  const copy = medicalContent[locale];

  const copyAll = async () => {
    if (await copyText(analysisText(analysis, locale)))
      showToast({ title: copy.copied });
  };

  return (
    <View style={styles.report}>
      {analysis.kind === "report" ? (
        <ReportSections report={analysis.report} />
      ) : (
        <AppText variant="chatBody" color={colors.surfaceText} selectable>
          {analysis.text}
        </AppText>
      )}
      <AppButton
        title={copy.copyText}
        variant="surface"
        size="medium"
        onPress={copyAll}
      />
    </View>
  );
}

function ReportSections({ report }: { report: PrescriptionReport }) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const l = reportLabels[locale];
  const confidence = report.confidence.overall;
  const medications = report.medications.filter(
    (medication) => medication.name,
  );
  const labs = report.lab_results.filter((result) => result.test);
  const scan = report.scan_report;
  const hasScan = !!scan && !!(scan.type || scan.findings || scan.impression);
  const hasSummary = !!(
    report.doctor.name ||
    report.facility.name ||
    report.diagnosis
  );

  if (!hasSummary && !medications.length && !labs.length && !hasScan) {
    return (
      <AppText variant="panelLabel" color={colors.surfaceTextMuted}>
        {l.nothingFound}
      </AppText>
    );
  }

  return (
    <>
      {hasSummary || typeof confidence === "number" ? (
        <View style={styles.card}>
          {report.doctor.name ? (
            <InfoRow
              icon={{ set: "ionicons", name: "person-outline" }}
              label={l.doctor}
            >
              {report.doctor.name}
            </InfoRow>
          ) : null}
          {report.facility.name ? (
            <InfoRow
              icon={{ set: "ionicons", name: "business-outline" }}
              label={l.facility}
            >
              {report.facility.name}
            </InfoRow>
          ) : null}
          {report.diagnosis ? (
            <View style={styles.diagnosis}>
              <AppText variant="label" color={colors.surfaceTextMuted}>
                {l.diagnosis}
              </AppText>
              <AppText
                variant="statMedium"
                color={colors.surfaceAccentText}
                selectable
                style={styles.read}
              >
                {isolate(report.diagnosis)}
              </AppText>
            </View>
          ) : null}
          {typeof confidence === "number" ? (
            <View style={styles.confidence}>
              <View style={styles.confidenceLabel}>
                <AppText variant="label" color={colors.surfaceTextMuted}>
                  {l.confidence}
                </AppText>
                <AppText variant="label" color={colors.surfaceText}>
                  {isolate(`${Math.round(confidence * 100)}%`)}
                </AppText>
              </View>
              <ProgressBar progress={confidence} height={3} />
            </View>
          ) : null}
        </View>
      ) : null}

      {medications.length ? (
        <Section icon={{ set: "material", name: "pill" }} title={l.medications}>
          {medications.map((medication, index) => (
            <MedicationCard
              key={`${medication.name}-${index}`}
              medication={medication}
            />
          ))}
        </Section>
      ) : null}

      {labs.length ? <LabSection results={labs} /> : null}

      {hasScan && scan ? (
        <Section
          icon={{ set: "ionicons", name: "scan-outline" }}
          title={l.scanReport}
        >
          <View style={styles.card}>
            {scan.type ? (
              <StatusChip label={isolate(scan.type)} tone="accent" />
            ) : null}
            {scan.findings ? (
              <View style={styles.paragraph}>
                <AppText variant="label" color={colors.surfaceTextMuted}>
                  {l.findings}
                </AppText>
                <AppText
                  variant="chatBody"
                  color={colors.surfaceText}
                  selectable
                  style={styles.read}
                >
                  {isolate(scan.findings)}
                </AppText>
              </View>
            ) : null}
            {scan.impression ? (
              <View style={styles.impression}>
                <AppText variant="label" color={colors.surfaceAccentText}>
                  {l.impression}
                </AppText>
                <AppText
                  variant="chatBody"
                  color={colors.surfaceText}
                  selectable
                  style={styles.read}
                >
                  {isolate(scan.impression)}
                </AppText>
              </View>
            ) : null}
          </View>
        </Section>
      ) : null}
    </>
  );
}

/** A section's heading (gold icon and title, an optional note at the end) over its content. */
function Section({
  icon,
  title,
  note,
  children,
}: {
  icon: Glyph;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppIcon {...icon} size={scale(12)} color={colors.surfaceIcon} />
        <AppText
          variant="statMedium"
          color={colors.surfaceText}
          accessibilityRole="header"
          style={styles.sectionTitle}
        >
          {title}
        </AppText>
        {note}
      </View>
      {children}
    </View>
  );
}

/** A labelled fact in the summary card, e.g. the doctor's name. */
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: Glyph;
  label: string;
  children: string;
}) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <AppIcon {...icon} size={scale(11)} color={colors.surfaceIcon} />
      </View>
      <View style={styles.flex}>
        <AppText variant="label" color={colors.surfaceTextMuted}>
          {label}
        </AppText>
        <AppText
          variant="value"
          color={colors.surfaceText}
          selectable
          style={styles.read}
        >
          {isolate(children)}
        </AppText>
      </View>
    </View>
  );
}

function MedicationCard({ medication }: { medication: PrescribedMedication }) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const l = reportLabels[locale];
  const details = [
    { label: l.frequency, value: medication.frequency, icon: "time-outline" },
    { label: l.duration, value: medication.duration, icon: "calendar-outline" },
  ].filter((detail) => detail.value);

  return (
    <View style={[styles.card, styles.medication]}>
      <View style={styles.medicationHeading}>
        <View style={styles.infoIcon}>
          <AppIcon
            set="material"
            name="pill"
            size={scale(11)}
            color={colors.surfaceIcon}
          />
        </View>
        <AppText
          variant="value"
          color={colors.surfaceText}
          style={styles.readInRow}
          selectable
        >
          {isolate(medication.name ?? "")}
        </AppText>
        {medication.dose ? (
          <StatusChip label={isolate(medication.dose)} tone="accent" />
        ) : null}
      </View>
      {details.map((detail) => (
        <View key={detail.label} style={styles.medicationDetail}>
          <AppIcon
            set="ionicons"
            name={detail.icon}
            size={scale(9)}
            color={colors.surfaceTextMuted}
          />
          <AppText variant="label" color={colors.surfaceTextMuted}>
            {detail.label}
          </AppText>
          <AppText
            variant="label"
            color={colors.surfaceText}
            style={styles.readInRow}
            selectable
          >
            {isolate(detail.value ?? "")}
          </AppText>
        </View>
      ))}
    </View>
  );
}

/** Lab results as a table: test and reference range, then the value coloured by its flag. */
function LabSection({ results }: { results: readonly LabResult[] }) {
  const styles = useStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const l = reportLabels[locale];
  const outOfRange = results.filter(
    (result) => result.flag === "high" || result.flag === "low",
  );
  const flagged = results.some((result) => result.flag);

  const valueColor = (flag: LabResult["flag"]) =>
    flag === "high"
      ? colors.chipDangerText
      : flag === "low"
        ? colors.chipWarningText
        : colors.surfaceText;

  return (
    <Section
      icon={{ set: "ionicons", name: "flask-outline" }}
      title={l.labResults}
      note={
        flagged ? (
          <StatusChip
            label={
              outOfRange.length ? l.outOfRange(outOfRange.length) : l.allNormal
            }
            tone={outOfRange.length ? "warning" : "positive"}
          />
        ) : null
      }
    >
      <View style={[styles.card, styles.flush]}>
        {results.map((result, index) => {
          const value = joinPresent([result.value, result.unit], " ");
          return (
            <View
              key={`${result.test}-${index}`}
              style={[
                styles.labRow,
                index > 0 && styles.labDivider,
                result.flag === "high" && styles.labHigh,
                result.flag === "low" && styles.labLow,
              ]}
            >
              <View style={styles.flex}>
                <AppText
                  variant="panelLabel"
                  color={colors.surfaceText}
                  selectable
                  style={styles.read}
                >
                  {isolate(result.test ?? "")}
                </AppText>
                {result.reference_range ? (
                  <AppText
                    variant="labelSmall"
                    color={colors.surfaceTextMuted}
                    style={styles.read}
                  >
                    {`${l.reference} ${isolate(result.reference_range)}`}
                  </AppText>
                ) : null}
              </View>
              <View style={styles.labValue}>
                {value ? (
                  <AppText
                    variant="value"
                    color={valueColor(result.flag)}
                    selectable
                  >
                    {isolate(value)}
                  </AppText>
                ) : null}
                {result.flag ? (
                  <StatusChip
                    label={l.flags[result.flag]}
                    tone={FLAG_TONE[result.flag]}
                  />
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </Section>
  );
}

const useStyles = makeStyles(({ colors }, { scale }) => ({
  report: {
    rowGap: scale(14),
    paddingBottom: scale(6),
  },
  flex: {
    flex: 1,
  },
  /**
   * Text read from the document sizes to its content and sits at the reading edge, so an
   * English value lines up under its Arabic label instead of aligning to its own (left) edge.
   */
  read: {
    alignSelf: "flex-start",
  },
  // The same in a row: shrinks to its content and pushes what follows to the end.
  readInRow: {
    flexShrink: 1,
    marginEnd: "auto",
  },
  card: {
    rowGap: scale(9),
    padding: scale(10),
    borderRadius: scale(10),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    backgroundColor: colors.fieldFill,
  },
  flush: {
    padding: 0,
    rowGap: 0,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(8),
  },
  infoIcon: {
    width: scale(22),
    height: scale(22),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(6),
    borderWidth: scale(0.6),
    borderColor: colors.surfaceIconTileBorder,
    backgroundColor: colors.surfaceIconTileGradient[0],
  },
  diagnosis: {
    rowGap: scale(2),
    paddingTop: scale(9),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceDivider,
  },
  confidence: {
    rowGap: scale(5),
  },
  confidenceLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    rowGap: scale(8),
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(6),
  },
  sectionTitle: {
    flex: 1,
  },
  medication: {
    rowGap: scale(6),
  },
  medicationHeading: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(8),
  },
  medicationDetail: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(4),
    // Under the name, past the icon.
    marginStart: scale(30),
  },
  labRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: scale(10),
    paddingVertical: scale(8),
    paddingHorizontal: scale(10),
  },
  labDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surfaceDivider,
  },
  // Out-of-range rows are washed in their flag's colour.
  labHigh: {
    backgroundColor: colors.chipDangerFill,
  },
  labLow: {
    backgroundColor: colors.chipWarningFill,
  },
  labValue: {
    alignItems: "flex-end",
    rowGap: scale(3),
  },
  paragraph: {
    rowGap: scale(2),
  },
  impression: {
    rowGap: scale(2),
    padding: scale(8),
    borderRadius: scale(8),
    borderStartWidth: scale(2),
    borderStartColor: colors.surfaceAccentText,
    backgroundColor: colors.chipAccentFill,
  },
}));
