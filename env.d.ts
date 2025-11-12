/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue'
declare module 'vue-router'
declare module 'element-plus'
declare module '@element-plus/icons-vue'
declare module 'pinia'
declare module 'crypto-js'

declare interface ImportMetaEnv {
  readonly [key: string]: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
