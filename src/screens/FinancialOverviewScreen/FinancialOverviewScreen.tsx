import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type Glyph } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { SurfaceCard } from '@/components/common/SurfaceCard';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { InnerScreen } from '@/components/layout/InnerScreen';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ServiceTile } from '@/components/ui/ServiceTile';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { images } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useToast } from '@/hooks/useToast';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import { downloadPdf } from '@/services/documents/exportPdf';

import {
  SCHEDULE_PREVIEW,
  financeContent,
  financeIcons,
  formatAmount,
  formatDueDate,
  paidShare,
  paymentSchedule,
  unitFinance,
} from './FinancialOverviewScreen.data';
import { buildStatementDocument } from './FinancialOverviewScreen.documents';
import { financeDesign as d, useFinanceStyles } from './FinancialOverviewScreen.styles';


/**
 * Financial Overview (Assets/screens/financial overview 1.png and 2.png), in this app's frame:
 * the inner screens' header and tab bar, and glass panels with the fading gold rim. Opened from
 * Home's "Financial Overview" tile and the assistant's Payments insight.
 */
export function FinancialOverviewScreen() {
  const styles = useFinanceStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { showToast } = useToast();
  // Unit details, payments, the contract and the fee history aren't designed yet.
  const showUnderDevelopment = useUnderDevelopment();
  const copy = financeContent[locale];
  const [showAll, setShowAll] = useState(false);

  const finance = unitFinance;
  const share = paidShare(finance);
  const percent = `${Math.round(share * 100)}%`;
  const remaining = finance.price - finance.paid;
  const { total: totalInstallments, paid: paidInstallments } = finance.installments;
  const remainingInstallments = totalInstallments - paidInstallments;
  const payments = showAll ? paymentSchedule : paymentSchedule.slice(0, SCHEDULE_PREVIEW);

  const downloadStatement = useCallback(() => {
    downloadPdf(buildStatementDocument(finance, paymentSchedule, locale)).catch(() =>
      showToast({ title: copy.statementFailedTitle, body: copy.statementFailedBody }),
    );
  }, [copy, finance, locale, showToast]);

  const installmentStats = [
    { id: 'total', value: totalInstallments, label: copy.totalInstallments, progress: paidInstallments / totalInstallments, color: colors.financeRemaining },
    { id: 'paid', value: paidInstallments, label: copy.paidInstallments, progress: paidInstallments / totalInstallments, color: colors.financePaid },
    { id: 'remaining', value: remainingInstallments, label: copy.remainingInstallments, progress: remainingInstallments / totalInstallments, color: colors.financeRemaining },
  ];

  const documents: { id: string; label: string; icon: Glyph; onPress: () => void }[] = [
    { id: 'statement', label: copy.downloadStatement, icon: financeIcons.statement, onPress: downloadStatement },
    { id: 'contract', label: copy.contract, icon: financeIcons.contract, onPress: showUnderDevelopment },
  ];

  return (
    <InnerScreen overline={copy.overline} title={copy.title} showPropertyCard={false}>
      <UnitCard onPress={showUnderDevelopment} />

      {/* Unit price, and how much of it is paid */}
      <View style={styles.row}>
        <PressableCard onPress={showUnderDevelopment} label={copy.unitPrice} style={styles.half}>
          <SurfaceCard radius={d.radius} rim="feature" style={[styles.card, styles.priceCard]}>
            <Heading icon={financeIcons.price} title={copy.unitPrice} bare chevron />
            <View style={styles.priceBox}>
              <Amount value={finance.price} currency={copy.currency} large />
            </View>
          </SurfaceCard>
        </PressableCard>

        <SurfaceCard radius={d.radius} rim="feature" style={[styles.card, styles.ringCard, styles.half]}>
          <ProgressRing
            size={scale(d.ring.size)}
            strokeWidth={scale(d.ring.stroke)}
            progress={share}
            color={colors.financePaid}
            trackColor={colors.financeRemaining}
          >
            <View style={styles.ringCentre} accessible accessibilityLabel={copy.paidOf(percent)}>
              <AppText variant="statMedium" color={colors.surfaceText}>
                {percent}
              </AppText>
              <AppText variant="cardLabel" color={colors.surfaceText}>
                {copy.paid}
              </AppText>
            </View>
          </ProgressRing>
          <View style={styles.legend}>
            <LegendItem color={colors.financePaid} label={copy.paid} value={finance.paid} currency={copy.currency} />
            <LegendItem color={colors.financeRemaining} label={copy.remaining} value={remaining} currency={copy.currency} />
          </View>
        </SurfaceCard>
      </View>

      {/* Total paid and remaining */}
      <View style={styles.row}>
        {[
          { id: 'paid', label: copy.totalPaid, value: finance.paid, icon: financeIcons.totalPaid },
          { id: 'remaining', label: copy.remainingAmount, value: remaining, icon: financeIcons.remaining },
        ].map((item) => (
          <PressableCard key={item.id} onPress={showUnderDevelopment} label={item.label} style={styles.half}>
            <SurfaceCard radius={d.radius} rim="feature" style={[styles.card, styles.amountCard]}>
              <IconBox icon={item.icon} small />
              <View style={styles.amountCardText}>
                <AppText variant="tileLabel" color={colors.surfaceText} numberOfLines={2}>
                  {item.label}
                </AppText>
                <Amount value={item.value} currency={copy.currency} />
              </View>
              {/* In the corner, so the label keeps the card's width. */}
              <View style={styles.cornerChevron}>
                <Chevron />
              </View>
            </SurfaceCard>
          </PressableCard>
        ))}
      </View>

      {/* Installment overview */}
      <SurfaceCard radius={d.radius} rim="feature" style={styles.panel}>
        <Heading
          icon={financeIcons.installments}
          title={copy.installmentOverview}
          chevron
          onPress={showUnderDevelopment}
        />
        <View style={styles.stats}>
          {installmentStats.map((stat) => (
            <View key={stat.id} style={styles.stat} accessible accessibilityLabel={`${stat.label}: ${stat.value}`}>
              <AppText variant="statMedium" color={colors.surfaceText} style={styles.statFigure}>
                {String(stat.value)}
              </AppText>
              <AppText variant="tileLabel" color={colors.surfaceText} numberOfLines={1}>
                {stat.label}
              </AppText>
              <ProgressBar
                progress={stat.progress}
                height={d.stat.bar.height}
                colors={[stat.color, stat.color]}
                trackColor={colors.financeTrack}
                style={styles.statBar}
              />
            </View>
          ))}
        </View>
      </SurfaceCard>

      {/* Next installment */}
      <SurfaceCard radius={d.radius} rim="feature" style={[styles.card, styles.next]}>
        <View style={styles.nextHalf}>
          <IconBox icon={financeIcons.nextInstallment} />
          <View style={styles.nextText}>
            <AppText variant="tileLabel" color={colors.surfaceText}>
              {copy.nextInstallment}
            </AppText>
            <Amount value={finance.nextInstallment.amount} currency={copy.currency} large />
          </View>
        </View>
        <View style={styles.nextDivider} />
        <View style={styles.nextHalf}>
          <IconBox icon={financeIcons.dueDate} />
          <View style={styles.nextText}>
            <View style={styles.dueRow}>
              <AppText variant="tileLabel" color={colors.surfaceText}>
                {copy.dueDate}
              </AppText>
              <AppText variant="tileLabel" color={colors.surfaceText}>
                {formatDueDate(finance.nextInstallment.due, locale)}
              </AppText>
            </View>
            <Pressable
              onPress={showUnderDevelopment}
              accessibilityRole="button"
              accessibilityLabel={copy.payNow}
              style={({ pressed }) => [styles.payNow, pressed && styles.pressed]}
            >
              <AppText variant="tileLabel" color={colors.buttonOutlineText}>
                {copy.payNow}
              </AppText>
              <ChevronIcon size={scale(d.chevron)} color={colors.buttonOutlineText} strokeWidth={3} />
            </Pressable>
          </View>
        </View>
      </SurfaceCard>

      {/* Maintenance fees */}
      <SurfaceCard radius={d.radius} rim="feature" style={styles.panel}>
        <Heading icon={financeIcons.maintenance} title={copy.maintenanceFees} chevron onPress={showUnderDevelopment} />
        <View style={styles.stats}>
          {[
            { id: 'annual', label: copy.annualFee, value: finance.maintenance.annualFee },
            { id: 'paid', label: copy.paid, value: finance.maintenance.paid },
            { id: 'outstanding', label: copy.outstanding, value: finance.maintenance.outstanding },
          ].map((fee) => (
            <View key={fee.id} style={styles.stat}>
              <AppText variant="tileLabel" color={colors.surfaceText} numberOfLines={1}>
                {fee.label}
              </AppText>
              <Amount value={fee.value} currency={copy.currency} />
            </View>
          ))}
        </View>
        <View style={styles.nextDue}>
          <AppIcon {...financeIcons.dueDate} size={scale(d.smallIcon)} color={colors.surfaceIcon} />
          <AppText variant="tileLabel" color={colors.surfaceText}>
            {`${copy.nextDue} ${formatDueDate(finance.maintenance.nextDue, locale)}`}
          </AppText>
        </View>
      </SurfaceCard>

      {/* Payment schedule */}
      <SurfaceCard radius={d.radius} rim="feature" style={styles.panel}>
        <Heading
          icon={financeIcons.schedule}
          title={copy.paymentSchedule}
          trailing={
            paymentSchedule.length > SCHEDULE_PREVIEW ? (
              <Pressable
                onPress={() => setShowAll((current) => !current)}
                hitSlop={scale(8)}
                accessibilityRole="button"
                accessibilityState={{ expanded: showAll }}
                style={styles.link}
              >
                <AppText variant="tileLabel" color={colors.surfaceAccentText}>
                  {showAll ? copy.showLess : copy.viewAll}
                </AppText>
                <ChevronIcon size={scale(d.chevron)} color={colors.surfaceAccentText} strokeWidth={3} />
              </Pressable>
            ) : null
          }
        />
        {payments.map((payment) => (
          <View
            key={payment.id}
            style={styles.paymentRow}
            accessible
            accessibilityLabel={`${copy.paidKind[payment.kind]}, ${formatDueDate(payment.date, locale)}, ${formatAmount(payment.amount)} ${copy.currency}`}
          >
            <View style={styles.paymentCheck}>
              <AppIcon set="material" name="check-circle" size={scale(18)} color={colors.statusPositive} />
            </View>
            <View style={styles.paymentText}>
              <AppText variant="tileLabel" color={colors.surfaceText}>
                {copy.paidKind[payment.kind]}
              </AppText>
              <AppText variant="cardLabel" color={colors.surfaceText}>
                {formatDueDate(payment.date, locale)}
              </AppText>
            </View>
            <AppText variant="tileLabel" color={colors.surfaceText}>
              {`${formatAmount(payment.amount)} ${copy.currency}`}
            </AppText>
          </View>
        ))}
      </SurfaceCard>

      {/* Statement and contract */}
      <View style={styles.row}>
        {documents.map((doc) => (
          <ServiceTile
            key={doc.id}
            label={doc.label}
            icon={<AppIcon {...doc.icon} size={scale(15)} color={colors.surfaceIcon} />}
            onPress={doc.onPress}
            style={styles.tile}
          />
        ))}
      </View>
    </InnerScreen>
  );
}

/** The unit with its building photo, in the property card's design (SummaryCard). */
function UnitCard({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const { locale } = useLocale();
  const copy = financeContent[locale];
  const finance = unitFinance;
  return (
    <SummaryCard
      photo={images.featuredCommunityOpal}
      title={finance.unitName}
      subtitle={copy.myUnit}
      badge={finance.usage[locale]}
      meta={finance.building[locale]}
      metaIcon={<AppIcon {...financeIcons.unit} size={scale(d.unit.metaIcon)} color={colors.progressText} />}
      onPress={onPress}
    />
  );
}

/** A gold glyph in the cards' small inset box. */
function IconBox({ icon, small = false }: { icon: Glyph; small?: boolean }) {
  const styles = useFinanceStyles();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const size = scale(small ? d.iconBox.small : d.iconBox.size);
  return (
    <LinearGradient colors={colors.surfaceIconTileGradient} style={[styles.iconBox, { width: size, height: size }]}>
      <AppIcon {...icon} size={scale(d.iconBox.icon)} color={colors.surfaceIcon} />
    </LinearGradient>
  );
}

function Chevron() {
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  return (
    // Wrapped: a bare SVG would paint under the card's glass on web.
    <View>
      <ChevronIcon size={scale(d.chevron)} color={colors.surfaceText} strokeWidth={3} />
    </View>
  );
}

/** A card's heading: its icon (boxed, or bare for a compact card), title, and a chevron or link. */
function Heading({
  icon,
  title,
  bare = false,
  chevron = false,
  trailing,
  onPress,
}: {
  icon: Glyph;
  title: string;
  bare?: boolean;
  chevron?: boolean;
  trailing?: ReactNode;
  onPress?: () => void;
}) {
  const styles = useFinanceStyles();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const content = (
    <View style={styles.heading}>
      {bare ? (
        <AppIcon {...icon} size={scale(d.iconBox.icon)} color={colors.surfaceIcon} />
      ) : (
        <IconBox icon={icon} />
      )}
      <AppText variant="tileLabel" color={colors.surfaceText} style={styles.headingText} accessibilityRole="header">
        {title}
      </AppText>
      {trailing}
      {chevron ? <Chevron /> : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {content}
    </Pressable>
  );
}

/** "95,000 OMR": the figure, then the currency a size down. */
function Amount({ value, currency, large = false }: { value: number; currency: string; large?: boolean }) {
  const styles = useFinanceStyles();
  const { colors } = useAppTheme();
  return (
    <View style={styles.amountRow}>
      <AppText variant="statMedium" color={colors.surfaceText} style={large ? styles.amountLarge : styles.amount}>
        {formatAmount(value)}
      </AppText>
      <AppText variant="cardLabel" color={colors.surfaceText}>
        {currency}
      </AppText>
    </View>
  );
}

function LegendItem({ color, label, value, currency }: { color: string; label: string; value: number; currency: string }) {
  const styles = useFinanceStyles();
  const { colors } = useAppTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <View>
        <AppText variant="tileLabel" color={colors.surfaceText}>
          {label}
        </AppText>
        <View style={styles.amountRow}>
          <AppText variant="tileLabel" color={colors.surfaceText}>
            {formatAmount(value)}
          </AppText>
          <AppText variant="cardLabel" color={colors.surfaceText}>
            {currency}
          </AppText>
        </View>
      </View>
    </View>
  );
}

/** A whole card as one button. */
function PressableCard({
  onPress,
  label,
  style,
  children,
}: {
  onPress: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const styles = useFinanceStyles();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}
