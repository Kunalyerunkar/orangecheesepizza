/// <reference types="vite/client" />

// Allow process.env access in TypeScript files
interface Process {
  env: {
    NODE_ENV: "development" | "production" | "test";
    [key: string]: string | undefined;
  };
}

declare var process: Process;

// Add custom environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CLOUD_NAME: string;
  readonly VITE_CLOUD_API_KEY: string;
  readonly VITE_CLOUD_API_SECRET: string;
  readonly VITE_UPLOAD_PRESET: string;
  // Add other custom env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
