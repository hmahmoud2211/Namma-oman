import { LinearGradient } from 'expo-linear-gradient';
import { Fragment, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, View, type LayoutChangeEvent } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { InnerScreen, useInnerScreen } from '@/components/layout/InnerScreen';
import { FilterChip } from '@/components/ui/FilterChip';
import { ListRow } from '@/components/ui/ListRow';
import { Panel } from '@/components/ui/Panel';
import { PanelHeading } from '@/components/ui/PanelHeading';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { formatDay } from '@/utils/date';

import { guestsLabel } from '../VisitorAccessScreen/VisitorAccessScreen.data';
import {
  amenities,
  amenitiesContent,
  amenitiesFor,
  categoryChips,
  createBooking,
  hoursLabel,
  initialVisibleCount,
  sampleBookings,
  slotLabel,
  type Amenity,
  type Booking,
  type BookingForm as BookingValues,
  type CategoryFilter,
} from './AmenitiesBookingScreen.data';
import { useAmenitiesStyles } from './AmenitiesBookingScreen.styles';
import { BookingForm } from './BookingForm';

export function AmenitiesBookingScreen() {
  const { locale } = useLocale();
  const copy = amenitiesContent[locale];
  return (
    <InnerScreen overline={copy.overline} title={copy.title} subtitle={copy.subtitle}>
      <AmenitiesContent />
    </InnerScreen>
  );
}

function AmenitiesContent() {
  const styles = useAmenitiesStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { scrollToColumnY } = useInnerScreen();
  const copy = amenitiesContent[locale];

  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [expanded, setExpanded] = useState(false);
  const matching = amenitiesFor(filter);
  const visible = expanded ? matching : matching.slice(0, initialVisibleCount);
  // Hidden when the filter already fits in the first screenful.
  const canExpand = matching.length > initialVisibleCount;

  // Screen-local until there is a booking service to send them to.
  // TODO(api): book, list and cancel through the amenities service once it exists.
  const [bookings, setBookings] = useState<readonly Booking[]>(() => sampleBookings());
  /** The amenity whose booking form is open under its card, if any. */
  const [bookingFor, setBookingFor] = useState<Amenity['id'] | null>(null);

  const listY = useRef(0);
  const formY = useRef(0);
  const bookingsY = useRef(0);
  const scrollToFormOnLayout = useRef(false);
  const scrollToBookingsOnLayout = useRef(false);

  // "Book Now" and the card's heading both open the form under that card.
  const openBooking = (id: Amenity['id']) => {
    if (bookingFor === id) {
      scrollToColumnY(listY.current + formY.current);
      return;
    }
    scrollToFormOnLayout.current = true;
    setBookingFor(id);
  };

  const confirmBooking = (amenity: Amenity, form: BookingValues) => {
    const booking = createBooking(form, amenity, bookings);
    setBookings((current) => [...current, booking]);
    setBookingFor(null);
    AccessibilityInfo.announceForAccessibility(
      copy.booked(amenity.title[locale], formatDay(booking.date, locale), slotLabel(booking.slot)),
    );
    // The form folds away and the booking shows in My Bookings, scrolled to once it has moved.
    scrollToBookingsOnLayout.current = true;
  };

  const cancelBooking = (id: string) =>
    setBookings((current) => current.filter((booking) => booking.id !== id));

  const onFormLayout = (event: LayoutChangeEvent) => {
    formY.current = event.nativeEvent.layout.y;
    if (scrollToFormOnLayout.current) {
      scrollToFormOnLayout.current = false;
      scrollToColumnY(listY.current + formY.current);
    }
  };

  const onBookingsLayout = (event: LayoutChangeEvent) => {
    bookingsY.current = event.nativeEvent.layout.y;
    if (scrollToBookingsOnLayout.current) {
      scrollToBookingsOnLayout.current = false;
      scrollToColumnY(bookingsY.current);
    }
  };

  return (
    <>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {categoryChips.map((chip) => (
          <FilterChip
            key={chip.id}
            label={chip.label[locale]}
            icon={chip.icon}
            selected={chip.id === filter}
            onPress={() => setFilter(chip.id)}
            role="radio"
            style={styles.chip}
          />
        ))}
      </View>

      <View
        style={styles.list}
        onLayout={(event) => {
          listY.current = event.nativeEvent.layout.y;
        }}
      >
        {visible.map((amenity) => (
          <Fragment key={amenity.id}>
            <AmenityCard amenity={amenity} onBook={() => openBooking(amenity.id)} />
            {bookingFor === amenity.id ? (
              <View onLayout={onFormLayout}>
                <BookingForm
                  amenity={amenity}
                  bookings={bookings}
                  onSubmit={(form) => confirmBooking(amenity, form)}
                  onClose={() => setBookingFor(null)}
                />
              </View>
            ) : null}
          </Fragment>
        ))}
        {visible.length === 0 ? (
          <AppText variant="labelLarge" color={colors.textOnBackgroundMuted} align="center">
            {copy.empty}
          </AppText>
        ) : null}
      </View>

      {canExpand ? (
        <AppButton
          title={expanded ? copy.showLess : copy.viewMore}
          variant="outline"
          size="medium"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((current) => !current)}
        />
      ) : null}

      {bookings.length > 0 ? (
        <View onLayout={onBookingsLayout}>
          <Panel>
            <PanelHeading
              title={copy.bookingsTitle}
              icon={{ set: 'ionicons', name: 'calendar-outline' }}
            />
            {bookings.map((booking, index) => {
              const amenity = amenities.find((entry) => entry.id === booking.amenityId);
              if (!amenity) return null;
              const title = amenity.title[locale];
              const date = formatDay(booking.date, locale);
              return (
                <ListRow
                  key={booking.id}
                  divided={index > 0}
                  icon={amenity.icon}
                  title={title}
                  details={[
                    `${date} • ${slotLabel(booking.slot)} • ${guestsLabel(booking.guests, locale)}`,
                  ]}
                  trailing={
                    <Pressable
                      onPress={() => cancelBooking(booking.id)}
                      hitSlop={scale(10)}
                      accessibilityRole="button"
                      accessibilityLabel={copy.cancelBooking(title, date)}
                      style={({ pressed }) => pressed && styles.pressed}
                    >
                      <AppIcon
                        set="ionicons"
                        name="close-circle-outline"
                        size={scale(15)}
                        color={colors.destructiveText}
                      />
                    </Pressable>
                  }
                />
              );
            })}
          </Panel>
        </View>
      ) : null}
    </>
  );
}

/** One amenity: its glyph tile, name and place, hours and capacity, and "Book Now". */
function AmenityCard({ amenity, onBook }: { amenity: Amenity; onBook: () => void }) {
  const styles = useAmenitiesStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const copy = amenitiesContent[locale];
  const title = amenity.title[locale];

  return (
    <Panel style={styles.card}>
      <LinearGradient colors={colors.surfaceIconTileGradient} style={styles.cardTile}>
        <AppIcon {...amenity.icon} size={scale(26)} color={colors.surfaceIcon} />
      </LinearGradient>
      <View style={styles.cardBody}>
        {/* The heading opens the booking form too; "Book Now" is its own target beside it. */}
        <Pressable
          onPress={onBook}
          accessibilityRole="button"
          accessibilityLabel={`${title}, ${amenity.location[locale]}`}
          accessibilityHint={copy.openForm}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <AppText variant="panelHeading" color={colors.surfaceText} numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="label" color={colors.surfaceTextMuted} numberOfLines={1}>
            {amenity.location[locale]}
          </AppText>
        </Pressable>
        <View style={styles.cardFooter}>
          <View style={styles.cardDetails}>
            <View
              style={styles.cardDetail}
              accessible
              accessibilityLabel={`${copy.hours}: ${hoursLabel(amenity)}`}
            >
              <AppIcon
                set="ionicons"
                name="time-outline"
                size={scale(9)}
                color={colors.surfaceIcon}
              />
              <AppText variant="labelSmall" color={colors.surfaceText}>
                {hoursLabel(amenity)}
              </AppText>
            </View>
            <View style={styles.cardDetail}>
              <AppIcon
                set="ionicons"
                name="people-outline"
                size={scale(9)}
                color={colors.surfaceIcon}
              />
              <AppText variant="labelSmall" color={colors.surfaceText}>
                {copy.capacity(amenity.capacity)}
              </AppText>
            </View>
          </View>
          <AppButton
            title={copy.bookNow}
            variant="emerald"
            size="small"
            accessibilityLabel={`${copy.bookNow}: ${title}`}
            onPress={onBook}
          />
        </View>
      </View>
    </Panel>
  );
}
