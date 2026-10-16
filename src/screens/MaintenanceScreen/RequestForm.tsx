import { useState } from 'react';
import { Keyboard } from 'react-native';

import { SelectField, TextField } from '@/components/common/FormField';
import { useInnerScreen } from '@/components/layout/InnerScreen';
import { FormPanel, FormRow } from '@/components/ui/FormPanel';
import { useLocale } from '@/hooks/useLocale';
import { makeStyles } from '@/utils/makeStyles';

import {
  categoryOptions,
  emptyRequestForm,
  maintenanceContent,
  requestFieldCopy,
  requestFieldRows,
  requestSelectLabel,
  validateRequest,
  visitDateOptions,
  windowOptions,
  type RequestFieldConfig,
  type RequestForm as RequestFormValues,
  type RequestFormErrors,
  type RequestFormKey,
  type RequestSelectKey,
} from './MaintenanceScreen.data';

interface RequestFormProps {
  /** Fills in the category, e.g. when the form was opened from its tile. */
  categoryId?: string;
  /** Receives a form that passed validation. */
  onSubmit: (form: RequestFormValues) => void;
  onClose: () => void;
}

/**
 * The new maintenance request: text fields, fields that open a list of choices, and the
 * submit button. The form keeps its own values; the screen only receives a valid request.
 */
export function RequestForm({ categoryId, onSubmit, onClose }: RequestFormProps) {
  const { locale } = useLocale();
  const { pickOption } = useInnerScreen();
  const styles = useStyles();
  const copy = maintenanceContent[locale];
  const labels = requestFieldCopy[locale];
  const [form, setForm] = useState<RequestFormValues>(() => ({
    ...emptyRequestForm,
    category: categoryId ?? '',
  }));
  const [errors, setErrors] = useState<RequestFormErrors>({});

  // Another tile tapped while the form is open picks that category instead.
  // Adjusted during render, as React recommends for state that follows a prop.
  const [lastCategory, setLastCategory] = useState(categoryId);
  if (categoryId !== lastCategory) {
    setLastCategory(categoryId);
    if (categoryId) {
      setForm((current) => ({ ...current, category: categoryId }));
      setErrors((current) => ({ ...current, category: undefined }));
    }
  }

  const update = (key: RequestFormKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    // Editing a field clears its message; the rest wait for the next submit.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const open = (key: RequestSelectKey) => {
    Keyboard.dismiss();
    pickOption({
      title: labels[key].label,
      options:
        key === 'category'
          ? categoryOptions(locale)
          : key === 'date'
            ? visitDateOptions(locale)
            : windowOptions(locale),
      selectedId: form[key],
      onSelect: (option) => update(key, option.id),
    });
  };

  const submit = () => {
    Keyboard.dismiss();
    const found = validateRequest(form, locale);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit(form);
  };

  const renderField = (field: RequestFieldConfig) => {
    const { label, placeholder } = labels[field.key];
    if (field.kind === 'select') {
      const key = field.key as RequestSelectKey;
      return (
        <SelectField
          key={key}
          label={label}
          placeholder={placeholder}
          value={requestSelectLabel(key, form[key], locale)}
          icon={field.icon}
          error={errors[key]}
          onPress={() => open(key)}
          style={styles.field}
        />
      );
    }
    return (
      <TextField
        key={field.key}
        label={label}
        placeholder={placeholder}
        value={form[field.key]}
        onChangeText={(text) => update(field.key, text)}
        icon={field.icon}
        error={errors[field.key]}
        autoCapitalize="sentences"
        maxLength={field.key === 'issue' ? 60 : 200}
        returnKeyType="done"
        style={styles.field}
      />
    );
  };

  return (
    <FormPanel
      icon={{ set: 'ionicons', name: 'construct-outline' }}
      title={copy.formTitle}
      subtitle={copy.formSubtitle}
      submitLabel={copy.submit}
      onSubmit={submit}
      onClose={onClose}
      closeLabel={copy.closeForm}
    >
      {requestFieldRows.map((row) => (
        <FormRow key={row[0].key}>{row.map(renderField)}</FormRow>
      ))}
    </FormPanel>
  );
}

const useStyles = makeStyles(() => ({
  field: {
    flex: 1,
  },
}));
