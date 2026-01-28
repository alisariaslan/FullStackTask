// src/components/ApiErrorMessage.tsx
'use client';

import { useApiError } from '@/hooks/useApiError';

interface Props {
    message: string;
}

export default function ApiErrorMessage({ message }: Props) {
    const { resolveError } = useApiError();

    const resolvedMessage = resolveError(message) || message;

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{resolvedMessage}</p>
        </div>
    );
}