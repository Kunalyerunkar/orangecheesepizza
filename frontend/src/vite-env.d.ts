/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  // more env variables...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
