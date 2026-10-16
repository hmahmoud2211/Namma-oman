import { useState } from 'react';

import { SelectField } from '@/components/common/FormField';
import { useInnerScreen } from '@/components/layout/InnerScreen';
import { FormPanel, FormRow } from '@/components/ui/FormPanel';
import { useLocale } from '@/hooks/useLocale';
import { formatDay } from '@/utils/date';
import { makeStyles } from '@/utils/makeStyles';

import { guestsLabel } from '../VisitorAccessScreen/VisitorAccessScreen.data';
import {
  amenitiesContent,
  bookingDateOptions,
  bookingGuestOptions,
  slotLabel,
  slotOptions,
  validateBooking,
  type Amenity,
  type Booking,
  type BookingErrors,
  type BookingForm as BookingValues,
} from './AmenitiesBookingScreen.data';

interface BookingFormProps {
  amenity: Amenity;
  /** The resident's bookings, so the same slot can't be booked twice. */
  bookings: readonly Booking[];
  /** Receives a booking that passed validation. */
  onSubmit: (form: BookingValues) => void;
  onClose: () => void;
}

/** Books one amenity: a day, a one-hour slot within its hours, and the party size. */
export function BookingForm({ amenity, bookings, onSubmit, onClose }: BookingFormProps) {
  const { locale } = useLocale();
  const { pickOption } = useInnerScreen();
  const styles = useStyles();
  const copy = amenitiesContent[locale];
  const [form, setForm] = useState<BookingValues>({ date: '', slot: '', guests: '1' });
  const [errors, setErrors] = useState<BookingErrors>({});

  const update = (key: keyof BookingValues, value: string) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      // A new day can rule out the chosen time (e.g. one already past today).
      if (
        key === 'date' &&
        next.slot &&
        !slotOptions(amenity, value).some((option) => option.id === next.slot)
      ) {
        next.slot = '';
      }
      return next;
    });
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const open = (key: keyof BookingValues, title: string) =>
    pickOption({
      title,
      options:
        key === 'date'
          ? bookingDateOptions(locale)
          : key === 'slot'
            ? // Until a day is chosen, the slots are the amenity's full hours.
              slotOptions(amenity, form.date)
            : bookingGuestOptions(amenity, locale),
      selectedId: form[key],
      emptyLabel: copy.noSlots,
      onSelect: (option) => update(key, option.id),
    });

  const submit = () => {
    const found = validateBooking(form, amenity, bookings, locale);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit(form);
  };

  return (
    <FormPanel
      icon={amenity.icon}
      title={copy.formTitle(amenity.title[locale])}
      subtitle={copy.formSubtitle}
      submitLabel={copy.confirm}
      onSubmit={submit}
      onClose={onClose}
      closeLabel={copy.closeForm}
    >
      <FormRow>
        <SelectField
          label={copy.dateLabel}
          placeholder={copy.datePlaceholder}
          value={form.date ? formatDay(form.date, locale) : ''}
          icon={{ set: 'ionicons', name: 'calendar-outline' }}
          error={errors.date}
          onPress={() => open('date', copy.dateLabel)}
          style={styles.field}
        />
        <SelectField
          label={copy.slotLabel}
          placeholder={copy.slotPlaceholder}
          value={form.slot ? slotLabel(form.slot) : ''}
          icon={{ set: 'ionicons', name: 'time-outline' }}
          error={errors.slot}
          onPress={() => open('slot', copy.slotLabel)}
          style={styles.field}
        />
      </FormRow>
      <SelectField
        label={copy.guestsLabel}
        placeholder=""
        value={guestsLabel(Number(form.guests), locale)}
        icon={{ set: 'ionicons', name: 'people-outline' }}
        onPress={() => open('guests', copy.guestsLabel)}
      />
    </FormPanel>
  );
}

const useStyles = makeStyles(() => ({
  field: {
    flex: 1,
  },
}));
