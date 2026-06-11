type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface AppConfig {
  appTitle: string;
  env: 'development' | 'staging' | 'production';
  baseUrl: string;
  enableDevtools: boolean;
  enableMock: boolean;
  logLevel: LogLevel;
  apiBaseUrl: string;
  enableAnalytics: boolean;
  isDev: boolean;
  isProd: boolean;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const env = import.meta.env.VITE_APP_ENV || 'development';

const config: AppConfig = {
  appTitle: import.meta.env.VITE_APP_TITLE || '元素对决',
  env: env as AppConfig['env'],
  baseUrl: import.meta.env.VITE_BASE_URL || '/',
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  logLevel: (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  isDev: env === 'development',
  isProd: env === 'production',
};

export const logger = {
  debug: (...args: unknown[]) => {
    if (LOG_LEVEL_PRIORITY[config.logLevel] <= LOG_LEVEL_PRIORITY.debug) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (LOG_LEVEL_PRIORITY[config.logLevel] <= LOG_LEVEL_PRIORITY.info) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (LOG_LEVEL_PRIORITY[config.logLevel] <= LOG_LEVEL_PRIORITY.warn) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (LOG_LEVEL_PRIORITY[config.logLevel] <= LOG_LEVEL_PRIORITY.error) {
      console.error('[ERROR]', ...args);
    }
  },
};

export default config;
