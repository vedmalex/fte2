<#@ noContent #>
global.STARTTIME = new Date();

const debug = process.env.DEBUG_APP?.toLowerCase() == 'true'
if (debug) {
  const { Config } = require('pipeline.js')
  Config.timeout = parseInt(process.env.DEBUG_STAGE_TIMEOUT ?? '1000', 10)
}

global.SERVERCONFIG =
exports.config = {
  ssl: process.env.SSL?.toLowerCase() == 'true',
  sslConfig: {
    key: process.env.SSL_KEY_PATH || USELOCAL('./ssl/server.key'),
    cert: process.env.SSL_CERT_PATH || USELOCAL('./ssl/server.crt'),
  },
  enableGraphQL: process.env.ENABLE_GRAPHQL?.toLowerCase() == 'true',
  dbConnectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT ?? '1000', 10),
  sessionTimeout: parseInt(process.env.SESSION_CONNECTION_TIMEOUT ?? '1000', 10),
  noClientCache: process.env.NO_CLIENT_CACHE?.toLowerCase() == 'true',
  noHealthCheck: process.env.NO_HEALTH_CHECK?.toLowerCase() == 'true',
  noServerCache: process.env.NO_SERVER_CACHE?.toLowerCase() == 'true',
  noTranslationTools: process.env.NO_TRANSLATION_TOOLS?.toLowerCase() == 'true',
  theme: process.env.THEME,
  debug,
  RTL: process.env.RTL?.toLowerCase() == 'true',
  AppName: process.env.APP_NAME,
  language: process.env.LOCALE,
  genFolders: [global.USEGLOBAL("app.gen"), USELOCAL("app.gen")],
  frameworkFolder: global.USEGLOBAL("app.gen"),
  directEntryTimeout: process.env.DIRECT_TIMEOUT,
    telemetry: {
    enabled: process.env.TELEMETRY_ENABLED?.toLowerCase() === 'true' ?? true,
    serviceName: process.env.TELEMETRY_SERVICE_NAME ?? 'grainjs',
    exporter: process.env.TELEMETRY_EXPORTER ?? 'file', // 'file', 'otlp' или 'console'
    options: {
      file: {
        path:
          process.env.TELEMETRY_FILE_PATH ?? USELOCAL('telemetry/traces.json'),
        writeInterval: parseInt(
          process.env.TELEMETRY_WRITE_INTERVAL ?? '1000',
          10,
        ),
      },
      otlp: {
        endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        headers: process.env.OTEL_EXPORTER_OTLP_HEADERS,
      },
      console: {
        prettyPrint:
          process.env.TELEMETRY_CONSOLE_PRETTY?.toLowerCase() === 'true' ??
          true,
      },
    },
    mongodb: {
      enabled:
        process.env.TELEMETRY_MONGODB_ENABLED?.toLowerCase() === 'true' ?? true,
      enhancedDatabaseReporting:
        process.env.TELEMETRY_MONGODB_ENHANCED?.toLowerCase() === 'true' ??
        true,
    },
    dataloader: {
      enabled:
        process.env.TELEMETRY_DATALOADER_ENABLED?.toLowerCase() === 'true' ??
        true,
      enhancedReporting:
        process.env.TELEMETRY_DATALOADER_ENHANCED?.toLowerCase() === 'true' ??
        true,
    },
    mongoose: {
      enabled:
        process.env.TELEMETRY_MONGOOSE_ENABLED?.toLowerCase() === 'true' ??
        true,
      enhancedDatabaseReporting:
        process.env.TELEMETRY_MONGOOSE_ENHANCED?.toLowerCase() === 'true' ??
        true,
    },
    graphql: {
      enabled:
        process.env.TELEMETRY_GRAPHQL_ENABLED?.toLowerCase() === 'true' ?? true,
      allowValues:
        process.env.TELEMETRY_GRAPHQL_ALLOW_VALUES?.toLowerCase() === 'true' ??
        false,
      depth: parseInt(process.env.TELEMETRY_GRAPHQL_DEPTH ?? '7', 10),
      mergeItems:
        process.env.TELEMETRY_GRAPHQL_MERGE_ITEMS?.toLowerCase() === 'true' ??
        true,
      ignoreTrivialResolveSpans:
        process.env.TELEMETRY_GRAPHQL_IGNORE_TRIVIAL_RESOLVE_SPANS?.toLowerCase() ===
          'true' ?? true,
    },
  },
  impersonate: {
    maxAge: parseInt(process.env.IMPERSONATE_MAX_AGE ?? '86400', 10), // default 24 hours in seconds
  },
  connections: {
    system: process.env.SYSTEM_URL,
    local: process.env.LOCAL_URL ?? process.env.SYSTEM_URL,
    files: process.env.FILES_URL ?? process.env.SYSTEM_URL,
    users: process.env.USERS_URL ?? process.env.SYSTEM_URL,
    audit: process.env.AUDIT_URL ?? process.env.SYSTEM_URL,
    transactions: process.env.TRANSACTIONS_URL ?? process.env.SYSTEM_URL,
    session: process.env.SESSION_URL ?? process.env.SYSTEM_URL,
  },
};