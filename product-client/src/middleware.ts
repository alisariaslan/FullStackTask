//middleware.ts

import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

export default createMiddleware(routing);

export const config = {
    // API, _next ve statik dosyalar hariç TÜM yolları yakala
    matcher: ['/((?!api|_next|.*\\..*).*)']
};