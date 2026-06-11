/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_BASE_URL: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_ANALYTICS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
