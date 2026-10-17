import { createClient } from '@supabase/supabase-js'

/**
 * Supabase 客户端（Auth + Postgres + Storage）
 *
 * 环境变量在项目根目录 .env 中配置：
 *   VITE_SUPABASE_URL=你的项目 URL（形如 https://xxxx.supabase.co）
 *   VITE_SUPABASE_ANON_KEY=你的 anon public key
 * 配置完成后，Vite 会在构建时自动注入，无需修改本文件。
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] 未检测到 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY，请在项目根目录 .env 中填写后重新构建。'
  )
}

// 未配置时使用占位值，避免 createClient 直接抛错；真实请求会失败并给出提示
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
