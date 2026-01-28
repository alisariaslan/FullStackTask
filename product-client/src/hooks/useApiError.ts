// src/hooks/useApiError.ts
import { useTranslations } from 'next-intl';

export const useApiError = () => {
    const t = useTranslations('ApiErrors');

    const resolveError = (messageKey: string | null | undefined) => {
        if (!messageKey) return null;

        if (t.has(messageKey)) {
            return t(messageKey);
        }

        return messageKey;
    };

    return { resolveError };
};