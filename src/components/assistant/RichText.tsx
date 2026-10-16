import { Fragment, memo, useMemo, type ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import type { TextVariant } from '@/theme/typography';
import { makeStyles } from '@/utils/makeStyles';

interface RichTextProps {
  children: string;
  variant?: TextVariant;
  color: string;
  /** Bullets and numbers. */
  markerColor: string;
  style?: StyleProp<ViewStyle>;
}

/** The first strong character decides a paragraph's direction (HTML's dir="auto"). */
const RTL_CHAR = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
const LTR_CHAR = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ]/;

export function isRtlText(text: string): boolean {
  for (const char of text) {
    if (RTL_CHAR.test(char)) return true;
    if (LTR_CHAR.test(char)) return false;
  }
  return false;
}

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'bullet'; text: string; marker: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'gap' };

const HEADING = /^#{1,6}\s+(.*)$/;
const BULLET = /^\s*[-*•]\s+(.*)$/;
const NUMBERED = /^\s*(\d+)[.)]\s+(.*)$/;

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      if (blocks.length > 0 && blocks[blocks.length - 1].kind !== 'gap') {
        blocks.push({ kind: 'gap' });
      }
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      blocks.push({ kind: 'heading', text: heading[1] });
      continue;
    }
    const bullet = BULLET.exec(line);
    if (bullet) {
      blocks.push({ kind: 'bullet', text: bullet[1], marker: '•' });
      continue;
    }
    const numbered = NUMBERED.exec(line);
    if (numbered) {
      blocks.push({ kind: 'bullet', text: numbered[2], marker: `${numbered[1]}.` });
      continue;
    }
    blocks.push({ kind: 'paragraph', text: line.trim() });
  }
  while (blocks.length > 0 && blocks[blocks.length - 1].kind === 'gap') {
    blocks.pop();
  }
  return blocks;
}

/** `**bold**` (or `__bold__`) runs are set bold; everything else is literal. */
function inline(text: string, boldStyle: TextStyle): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).map((part, index) => {
    if (
      (part.startsWith('**') && part.endsWith('**')) ||
      (part.startsWith('__') && part.endsWith('__'))
    ) {
      return (
        <Text key={index} style={boldStyle}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    // Stray single asterisks (italics) are dropped rather than shown.
    return (
      <Fragment key={index}>
        {part.replace(/(^|\s)\*(\S[^*]*\S|\S)\*(?=\s|$|[.,!?])/g, '$1$2')}
      </Fragment>
    );
  });
}

/**
 * The light Markdown the assistant writes (bold, lists, headings), with each line set in its
 * own direction, so an Arabic answer that names an English device still reads line by line.
 */
function RichTextView({
  children,
  variant = 'chatBody',
  color,
  markerColor,
  style,
}: RichTextProps) {
  const { typography } = useAppTheme();
  const { isRTL } = useLocale();
  const styles = useStyles();
  const blocks = useMemo(() => parseBlocks(children), [children]);

  return (
    <View style={style}>
      {blocks.map((block, index) => {
        if (block.kind === 'gap') {
          return <View key={index} style={styles.gap} />;
        }
        const rtl = isRtlText(block.text);
        const direction = rtl ? styles.rtl : styles.ltr;
        // Bold follows the line's script, as the app's fonts do.
        const bold = {
          fontFamily: rtl
            ? typography.fontFamilies.arabicBold
            : typography.fontFamilies.roundedBold,
        };
        if (block.kind === 'heading') {
          return (
            <AppText
              key={index}
              variant="panelHeading"
              color={color}
              style={[direction, styles.heading]}
            >
              {inline(block.text, bold)}
            </AppText>
          );
        }
        if (block.kind === 'bullet') {
          return (
            // The marker leads the line: flip the row when the line runs against the layout.
            <View key={index} style={[styles.bulletRow, rtl !== isRTL && styles.bulletRowReversed]}>
              <AppText variant={variant} color={markerColor} style={styles.marker}>
                {block.marker}
              </AppText>
              <AppText variant={variant} color={color} style={[styles.bulletText, direction]}>
                {inline(block.text, bold)}
              </AppText>
            </View>
          );
        }
        return (
          <AppText key={index} variant={variant} color={color} style={direction}>
            {inline(block.text, bold)}
          </AppText>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  ltr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  heading: {
    marginTop: scale(4),
    marginBottom: scale(2),
  },
  gap: {
    height: scale(6),
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: scale(2),
  },
  bulletRowReversed: {
    flexDirection: 'row-reverse',
  },
  marker: {
    minWidth: scale(12),
    textAlign: 'center',
    marginHorizontal: scale(2),
  },
  bulletText: {
    flex: 1,
  },
}));

export const RichText = memo(RichTextView);
