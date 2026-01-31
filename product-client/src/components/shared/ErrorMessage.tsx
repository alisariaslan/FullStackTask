'use client';

import { useErrorMessage } from '@/hooks/useErrorMessage';

interface Props {
    message: string | null | undefined;
}

export default function ErrorMessage({ message }: Props) {
    const { resolveErrorMessage } = useErrorMessage();

    if (!message) return null;

    const displayMessage = resolveErrorMessage(message);

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{displayMessage}</span>
        </div>
    );
}