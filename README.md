# 区块链云存储系统

基于 Vue 3 + Element Plus 的前端应用，数据层接入 **Supabase**（Auth 认证 + Postgres 数据库 + Storage 对象存储），实现跨设备访问、个人账号与多样化数据存储。

## 技术栈

- Vue 3 + Vite 5 + TypeScript
- Element Plus + Pinia + Vue Router
- @supabase/supabase-js（Auth / Postgres / Storage）

## 快速开始

### 1. 创建 Supabase 项目

1. 前往 [supabase.com](https://supabase.com) 注册并创建项目（免费版即可）。
2. 进入项目后，打开 **Authentication → Sign In / Providers → Email**，**关闭 "Confirm email"**（否则注册后无法直接登录）。

### 2. 执行数据库脚本

打开 **SQL Editor**，粘贴并运行项目根目录的 [`supabase-schema.sql`](./supabase-schema.sql)。脚本会自动创建：

- `profiles` 用户资料表（关联 Auth 用户）
- `files` 文件元数据表
- 两张表的行级安全（RLS）策略：每个用户只能访问自己的数据
- `user-files` 存储桶及读写权限策略

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，填入项目信息（Dashboard → Project Settings → API）：

```
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_public_key
```

`.env` 已被 `.gitignore` 忽略，密钥不会提交到仓库。

### 4. 本地运行 / 构建

```bash
npm install
npm run dev      # 本地开发
npm run build    # 生产构建（输出 dist/）
```

## 部署（Netlify）

项目已配置 [`netlify.toml`](./netlify.toml)，包含 SPA 路由回退与安全响应头（X-Frame-Options / CSP 等，CSP 的 `connect-src` 已放行 `https://*.supabase.co`）。推送到 GitHub 即自动触发 Netlify 部署。

> 构建时请确保 Netlify 环境变量中同样配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`（Site Settings → Environment variables），否则线上页面会提示未配置。

## 目录结构

```
├── api/                 # 数据层（auth.ts 认证 / storage.ts 存储，已对接 Supabase）
├── lib/supabase.ts      # Supabase 客户端初始化
├── views/               # 页面（登录/存储/管理/安全/个人中心）
├── components/          # 组件（注册表单/上传表单）
├── router/              # 路由与登录守卫
├── supabase-schema.sql  # 数据库建表与安全策略
├── netlify.toml         # Netlify 构建与安全头配置
└── .env.example         # 环境变量模板
```
