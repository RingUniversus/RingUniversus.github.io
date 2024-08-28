/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_RPC: string;
  readonly VITE_DF_WEBSERVER_URL: string;
  readonly VITE_W3MODAL_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
