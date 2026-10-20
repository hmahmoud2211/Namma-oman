import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { ChevronIcon } from '@/components/icons/ChevronIcon';
import { InnerScreen, useInnerScreen } from '@/components/layout/InnerScreen';
import { Panel } from '@/components/ui/Panel';
import { images, IMAGE_TRANSITION_MS } from '@/constants/images';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';
import { useResponsive } from '@/hooks/useResponsive';
import { useToast } from '@/hooks/useToast';
import { useUnderDevelopment } from '@/hooks/useUnderDevelopment';
import type { PickedDocument } from '@/services/medical/medical.types';
import { pickDocument } from '@/services/medical/pickDocument';
import { analyzeDocument, PrescriptionApiError } from '@/services/medical/prescriptionApi';

import {
  CATEGORY_SEPARATOR,
  createUpload,
  medicalContent,
  medicalShortcuts,
  sampleFiles,
  uploadCategories,
  type MedicalDocumentType,
  type MedicalFile,
  type MedicalShortcut,
} from './MedicalScreen.data';
import { DocumentReport } from './DocumentReport';
import { medicalDesign as d, useMedicalStyles } from './MedicalScreen.styles';

export function MedicalScreen() {
  return (
    // The hero banner carries the page's title, so the frame's own intro is left out.
    <InnerScreen showPropertyCard={false}>
      <MedicalContent />
    </InnerScreen>
  );
}

function MedicalContent() {
  const navigation = useNavigation();
  const styles = useMedicalStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const { pickOption, openSheet } = useInnerScreen();
  const { showToast } = useToast();
  const showUnderDevelopment = useUnderDevelopment();
  const copy = medicalContent[locale];

  // This session's uploads, newest first, after the design's samples. Screen-local: the
  // workflow reads a document and answers; nothing yet lists the resident's past uploads.
  const [files, setFiles] = useState<readonly MedicalFile[]>(sampleFiles);
  const readCount = files.filter((file) => file.status === 'read').length;

  const updateFile = (id: string, changes: Partial<MedicalFile>) =>
    setFiles((current) => current.map((file) => (file.id === id ? { ...file, ...changes } : file)));

  /** Sends the document to the n8n reader and records its text, or the failure. */
  const readDocument = async (id: string, document: PickedDocument, type: MedicalDocumentType) => {
    updateFile(id, { status: 'reading' });
    try {
      const analysis = await analyzeDocument(document, type);
      updateFile(id, { status: 'read', analysis });
      showToast({ title: copy.readDone, body: document.name });
    } catch (error) {
      updateFile(id, { status: 'failed' });
      showToast({
        title: copy.readFailed,
        body: error instanceof PrescriptionApiError ? error.message : copy.readFailedBody,
      });
    }
  };

  const upload = async (type: MedicalDocumentType) => {
    const document = await pickDocument();
    if (!document) return;
    const file = createUpload(document, type, medicalContent);
    setFiles((current) => [file, ...current]);
    void readDocument(file.id, document, type);
  };

  // "Upload Files" asks what the document is first; the tiles already say.
  const chooseTypeAndUpload = () =>
    pickOption({
      title: copy.chooseType,
      kind: 'menu',
      options: uploadCategories.map((category) => ({ id: category.id, label: category.label[locale] })),
      onSelect: (option) => void upload(option.id as MedicalDocumentType),
    });

  const showText = (file: MedicalFile) => {
    if (!file.analysis) {
      showToast({ title: file.name[locale], body: copy.sampleNoText });
      return;
    }
    const analysis = file.analysis;
    openSheet({
      title: file.name[locale],
      render: () => <DocumentReport analysis={analysis} />,
    });
  };

  const openFileOptions = (file: MedicalFile) =>
    pickOption({
      title: copy.fileOptions,
      kind: 'menu',
      options: [
        file.status === 'failed'
          ? { id: 'retry', label: copy.retry, icon: { set: 'ionicons', name: 'refresh-outline' } }
          : { id: 'view', label: copy.viewFile, icon: { set: 'ionicons', name: 'eye-outline' } },
        {
          id: 'delete',
          label: copy.deleteFile,
          icon: { set: 'ionicons', name: 'trash-outline' },
          destructive: true,
        },
      ],
      onSelect: (option) => {
        if (option.id === 'view') {
          showText(file);
          return;
        }
        if (option.id === 'retry') {
          if (file.document) void readDocument(file.id, file.document, file.type);
          return;
        }
        setFiles((current) => current.filter((item) => item.id !== file.id));
        showToast({ title: copy.fileDeleted });
      },
    });

  const openShortcut = (shortcut: MedicalShortcut) =>
    shortcut.route ? navigation.navigate(shortcut.route) : showUnderDevelopment();

  return (
    <>
      <MedicalHero />

      <Panel style={styles.uploadPanel}>
        <AppText
          variant="value"
          color={colors.surfaceText}
          accessibilityRole="header"
          style={styles.uploadTitle}
        >
          {copy.uploadTitle}
        </AppText>
        <View style={styles.tiles}>
          {uploadCategories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => void upload(category.id)}
              accessibilityRole="button"
              accessibilityLabel={`${copy.uploadFiles}: ${category.label[locale]}`}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={colors.surfaceIconTileGradient}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.tileArt}>
                <Image
                  source={category.image}
                  contentFit="contain"
                  transition={IMAGE_TRANSITION_MS}
                  style={{
                    width: scale(category.imageSize.width),
                    height: scale(category.imageSize.height),
                  }}
                />
              </View>
              <AppText
                variant="label"
                color={colors.surfaceText}
                align="center"
                numberOfLines={1}
              >
                {category.label[locale]}
              </AppText>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={chooseTypeAndUpload}
          accessibilityRole="button"
          accessibilityLabel={copy.uploadFiles}
          style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}
        >
          <AppIcon
            set="material"
            name="file-upload-outline"
            size={scale(d.upload.button.icon)}
            color={colors.surfaceText}
          />
          <AppText variant="pillLabel" color={colors.surfaceText}>
            {copy.uploadFiles}
          </AppText>
        </Pressable>
      </Panel>

      <Panel style={styles.filesPanel}>
        <View style={styles.filesHeading}>
          <AppText
            variant="value"
            color={colors.surfaceText}
            accessibilityRole="header"
            style={styles.filesTitle}
          >
            {copy.filesTitle}
          </AppText>
          {readCount > 0 ? (
            <View style={styles.filesCount}>
              <UploadedCheck size={d.files.check} />
              <AppText variant="labelTiny" color={colors.surfaceText}>
                {copy.filesUploaded(readCount)}
              </AppText>
            </View>
          ) : null}
        </View>
        {files.length > 0 ? (
          <View style={styles.fileCards}>
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onOpen={() => (file.status === 'failed' ? openFileOptions(file) : showText(file))}
                onOptions={() => openFileOptions(file)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.noFiles}>
            <AppText variant="label" color={colors.surfaceTextMuted}>
              {copy.noFiles}
            </AppText>
          </View>
        )}
      </Panel>

      <View style={styles.shortcuts}>
        {medicalShortcuts.map((shortcut) => {
          const title = shortcut.title[locale];
          const description = shortcut.description[locale];
          return (
            <Pressable
              key={shortcut.id}
              onPress={() => openShortcut(shortcut)}
              accessibilityRole="button"
              accessibilityLabel={`${title}, ${description.replace('\n', ' ')}`}
              style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
            >
              <Panel flush style={styles.shortcutCard}>
                <Image
                  source={shortcut.image}
                  contentFit="contain"
                  transition={IMAGE_TRANSITION_MS}
                  style={styles.shortcutIcon}
                />
                <AppText
                  variant="panelLabel"
                  color={colors.surfaceText}
                  numberOfLines={1}
                  style={styles.shortcutTitle}
                >
                  {title}
                </AppText>
                <AppText
                  variant="labelLarge"
                  color={colors.surfaceTextMuted}
                  numberOfLines={2}
                  style={styles.shortcutDescription}
                >
                  {description}
                </AppText>
                <View style={styles.shortcutChevron} pointerEvents="none">
                  <ChevronIcon
                    size={scale(d.shortcuts.card.chevron)}
                    color={colors.surfaceText}
                    strokeWidth={3}
                  />
                </View>
              </Panel>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

/** The banner opening the page: what the service covers, beside the stethoscope art. */
function MedicalHero() {
  const styles = useMedicalStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const copy = medicalContent[locale];

  return (
    <Panel flush style={styles.hero}>
      <Image
        source={images.medicalHero}
        contentFit="cover"
        transition={IMAGE_TRANSITION_MS}
        style={styles.heroArt}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.heroText}>
        <AppText variant="label" color={colors.surfaceText}>
          {copy.overline}
        </AppText>
        <AppText variant="greetingName" color={colors.surfaceText} accessibilityRole="header">
          {copy.title}
        </AppText>
        <AppText variant="label" color={colors.surfaceText} style={styles.heroCategories}>
          {copy.categories.join(CATEGORY_SEPARATOR)}
        </AppText>
        <AppText variant="label" color={colors.surfaceText} style={styles.heroBody}>
          {copy.body}
        </AppText>
      </View>
    </Panel>
  );
}

interface FileCardProps {
  file: MedicalFile;
  /** Shows what was read (or, after a failure, the file's options). */
  onOpen: () => void;
  onOptions: () => void;
}

/**
 * An uploaded file: thumbnail, name, extent and its state (a spinner while the workflow reads
 * it, the tick once read, a warning if it failed), with its options button beside.
 */
function FileCard({ file, onOpen, onOptions }: FileCardProps) {
  const styles = useMedicalStyles();
  const { colors } = useAppTheme();
  const { locale } = useLocale();
  const { scale } = useResponsive();
  const copy = medicalContent[locale];
  const name = file.name[locale];
  const statusLabel = {
    reading: copy.reading,
    read: copy.uploadedLabel,
    failed: copy.readFailed,
  }[file.status];

  return (
    // Not itself a button: the options button is one, and web cannot nest buttons.
    <View style={styles.fileCard}>
      <LinearGradient
        colors={colors.surfaceIconTileGradient}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Pressable
        onPress={onOpen}
        disabled={file.status === 'reading'}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${file.extent[locale]}, ${statusLabel}`}
        accessibilityState={{ busy: file.status === 'reading' }}
        style={({ pressed }) => [styles.fileOpen, pressed && styles.pressed]}
      >
        {file.thumbnail ? (
          <Image
            source={file.thumbnail}
            contentFit="cover"
            transition={IMAGE_TRANSITION_MS}
            style={styles.fileThumb}
          />
        ) : (
          <View style={[styles.fileThumb, styles.fileThumbGlyph]}>
            <AppIcon
              set="ionicons"
              name="document-text-outline"
              size={scale(d.files.card.thumbWidth * 0.55)}
              color={colors.surfaceIcon}
            />
          </View>
        )}
        <View style={styles.fileText}>
          <AppText variant="labelSmall" color={colors.surfaceText} numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="labelTiny" color={colors.surfaceTextMuted} numberOfLines={1}>
            {file.status === 'reading' ? copy.reading : file.extent[locale]}
          </AppText>
          <View style={styles.fileCheck}>
            {file.status === 'read' ? <UploadedCheck size={d.files.card.check} /> : null}
            {file.status === 'reading' ? (
              // iOS takes no numeric size, so the small spinner is scaled down to the tick's.
              <ActivityIndicator size="small" color={colors.surfaceIcon} style={styles.spinner} />
            ) : null}
            {file.status === 'failed' ? (
              <AppIcon
                set="ionicons"
                name="alert-circle"
                size={scale(d.files.card.check + 1)}
                color={colors.destructiveText}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={onOptions}
        hitSlop={scale(8)}
        accessibilityRole="button"
        accessibilityLabel={`${copy.fileOptions}: ${name}`}
        style={({ pressed }) => [styles.fileMenu, pressed && styles.pressed]}
      >
        <AppIcon
          set="ionicons"
          name="ellipsis-vertical"
          size={scale(d.files.card.menu)}
          color={colors.surfaceText}
        />
      </Pressable>
    </View>
  );
}

/** The filled green circle with a tick, marking an upload as done. */
function UploadedCheck({ size }: { size: number }) {
  const styles = useMedicalStyles();
  const { colors } = useAppTheme();
  const { scale } = useResponsive();
  const box = scale(size);
  return (
    <View style={[styles.check, { width: box, height: box }]}>
      <CheckIcon size={box * 0.62} color={colors.uploadedCheckGlyph} />
    </View>
  );
}
