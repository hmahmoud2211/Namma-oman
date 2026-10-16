import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { View, type LayoutChangeEvent, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

import { useAccountMenu } from '@/components/layout/AccountMenu';
import { getMainTabBarInset, MainTabBar } from '@/components/layout/MainTabBar';
import { PageHeader, PageIntro, pageHeaderDesign } from '@/components/layout/PageHeader';
import { getScreenHeaderTop } from '@/components/layout/screenHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { OptionList, type ListOption } from '@/components/ui/OptionList';
import { images } from '@/constants/images';
import { resident } from '@/constants/resident';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useResponsive } from '@/hooks/useResponsive';
import { makeStyles } from '@/utils/makeStyles';
import { DESIGN_FRAME } from '@/utils/responsive';

/** Home's card column (HomeScreen.styles.ts): every inner screen's sections share it. */
export const INNER_COLUMN = { left: 27.4, width: 296.8 } as const;
/** Room kept above a section the screen scrolls to, in design dp. */
const SCROLL_MARGIN = 12;

export interface PickOptionRequest {
  title: string;
  options: readonly ListOption[];
  selectedId?: string;
  emptyLabel?: string;
  /** `menu` for commands (no tick), `radio` for a choice. */
  kind?: 'radio' | 'menu';
  onSelect: (option: ListOption) => void;
}

export interface SheetRequest {
  title: string;
  /** Content, or a function that receives `close` (animates out first). */
  render: (close: () => void) => ReactNode;
}

interface InnerScreenState {
  /** Opens a sheet listing choices; picking one closes it and calls `onSelect`. */
  pickOption: (request: PickOptionRequest) => void;
  /** Opens a sheet with custom content (one at a time). */
  openSheet: (request: SheetRequest) => void;
  /** Scrolls so that a section at `y` (from its onLayout inside the column) shows at the top. */
  scrollToColumnY: (y: number) => void;
}

const InnerScreenContext = createContext<InnerScreenState | null>(null);

/** The inner screen's sheet and scroll helpers, for screens and the forms inside them. */
export function useInnerScreen(): InnerScreenState {
  const state = use(InnerScreenContext);
  if (!state) {
    throw new Error('useInnerScreen must be used inside <InnerScreen>.');
  }
  return state;
}

interface InnerScreenProps {
  overline: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Keeps focused fields above the keyboard (screens with forms). */
  keyboardAvoiding?: boolean;
  /** Drawn over everything, e.g. a screen's own sheets. */
  overlay?: ReactNode;
}

/**
 * The shell every service screen shares (after Construction Progress): background, header with
 * back / logo / language / profile, the page intro, a scrolling column of sections, the main tab
 * bar, the profile menu, and a sheet host for pickers.
 */
export function InnerScreen({
  overline,
  title,
  subtitle,
  children,
  keyboardAvoiding = false,
  overlay,
}: InnerScreenProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const account = useAccountMenu();

  const scrollRef = useRef<ScrollViewInstance>(null);
  const columnY = useRef(0);
  const [sheet, setSheet] = useState<SheetRequest | null>(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const scrollToColumnY = useCallback(
    (y: number) => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, columnY.current + y - scale(SCROLL_MARGIN)),
        animated: true,
      });
    },
    [scale],
  );

  const pickOption = useCallback((request: PickOptionRequest) => {
    setSheet({
      title: request.title,
      render: (close) => (
        <OptionList
          options={request.options}
          selectedId={request.selectedId}
          emptyLabel={request.emptyLabel}
          kind={request.kind}
          onSelect={(option) => {
            close();
            request.onSelect(option);
          }}
        />
      ),
    });
  }, []);

  const context = useMemo(
    () => ({ pickOption, openSheet: setSheet, scrollToColumnY }),
    [pickOption, scrollToColumnY],
  );

  const handleColumnLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    columnY.current = nativeEvent.layout.y;
  }, []);

  return (
    <InnerScreenContext value={context}>
      <ScreenWrapper
        background={images.homeBackground}
        backgroundTint={colors.backgroundTint}
        scrollable
        keyboardAvoiding={keyboardAvoiding}
        scrollRef={scrollRef}
        overlay={
          <>
            <MainTabBar onReselect={scrollToTop} />
            {overlay}
            {sheet && (
              <BottomSheet key={sheet.title} title={sheet.title} onClose={() => setSheet(null)}>
                {(close) => sheet.render(close)}
              </BottomSheet>
            )}
            {account.menu}
          </>
        }
      >
        <View style={styles.content}>
          <PageHeader
            initials={resident.initials}
            onProfilePress={account.open}
            avatarRef={account.avatarRef}
          />
          <PageIntro overline={overline} title={title} subtitle={subtitle} />
          <View style={styles.column} onLayout={handleColumnLayout}>
            {children}
          </View>
        </View>
      </ScreenWrapper>
    </InnerScreenContext>
  );
}

const useStyles = makeStyles(({ spacing }, { width, height, scale }, insets: EdgeInsets) => ({
  // ScreenWrapper already pads by the insets; offsets here are relative to that.
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: scale(DESIGN_FRAME.width),
    alignSelf: 'center',
    paddingTop: getScreenHeaderTop(width, height, insets) - insets.top,
    paddingBottom: getMainTabBarInset(width, height, insets) - insets.bottom,
  },
  column: {
    marginTop: scale(spacing.xl),
    marginStart: scale(pageHeaderDesign.intro.left),
    width: scale(INNER_COLUMN.width),
    rowGap: scale(spacing.lg),
  },
}));
