import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { makeStyles } from '@/utils/makeStyles';

/** Design dp, from the Sign In "OR" divider. */
const LINE_THICKNESS = 0.5;
const LABEL_GAP = 10;

interface TextDividerProps {
  label: string;
  textColor: string;
  lineColor: string;
  style?: StyleProp<ViewStyle>;
}

/** Horizontal rule with a centered label, e.g. "— OR —". */
export function TextDivider({ label, textColor, lineColor, style }: TextDividerProps) {
  const styles = useStyles();
  const line = [styles.line, { backgroundColor: lineColor }];

  return (
    <View style={[styles.row, style]}>
      <View style={line} />
      <AppText variant="micro" color={textColor} style={styles.label}>
        {label}
      </AppText>
      <View style={line} />
    </View>
  );
}

const useStyles = makeStyles((_theme, { scale }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: scale(LINE_THICKNESS),
  },
  label: {
    marginHorizontal: scale(LABEL_GAP),
  },
}));
