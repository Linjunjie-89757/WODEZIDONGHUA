import type { UserProfile } from '../model/types';
import { t } from '@shared/i18n';

export function formatUserDisplayName(profile?: UserProfile | null) {
  return profile?.displayName || profile?.username || t.auth.unauthenticated;
}
