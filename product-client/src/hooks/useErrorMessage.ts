// src/hooks/useErrorMessage.ts
import { useTranslations } from 'next-intl';

export const useErrorMessage = () => {
    const tApi = useTranslations('ApiErrors');
    const tSystem = useTranslations('ClientErrors');

    const resolveErrorMessage = (message: string | null | undefined): string | null => {
        if (!message) return null;

        // Client errors
        if (message.startsWith('ClientErrors.')) {
            const key = message.split('.')[1];
            return tSystem.has(key) ? tSystem(key) : message;
        }

        // API errors
        if (tApi.has(message)) {
            return tApi(message);
        }
        return message;
    };

    return { resolveErrorMessage };
};