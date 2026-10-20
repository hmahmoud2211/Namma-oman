import * as DocumentPicker from 'expo-document-picker';

import { medicalConfig } from '@/constants/medicalConfig';

import type { PickedDocument } from './medical.types';

/** Opens the system file picker for one photo, scan or PDF; `null` if the resident cancels. */
export async function pickDocument(): Promise<PickedDocument | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [...medicalConfig.acceptedTypes],
    // So the file can still be read when it is sent (and sent again on "Try again").
    copyToCacheDirectory: true,
    multiple: false,
  });
  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) return null;
  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType ?? asset.file?.type ?? 'application/octet-stream',
    file: asset.file,
  };
}
