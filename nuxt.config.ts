import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-10-11',
  devtools: { enabled: false },
  ssr: true,
  components: [{ path: '~/components', pathPrefix: false }],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'zh',
    strategy: 'no_prefix',
    langDir: 'locales',
    detectBrowserLanguage: false
  },
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/main.css'
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN', 'data-theme': 'light' },
      title: 'QookiX Launcher — 跨平台 Minecraft 启动器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'QookiX 是基于 Tauri 的跨平台 Minecraft 启动器，纯净、轻量、无广告。支持 Fabric/Forge/NeoForge/Quilt，Modrinth + CurseForge 双源模组一键安装，云存档同步。' },
        { name: 'keywords', content: 'Minecraft 启动器,QookiX,Tauri,模组管理,Modrinth,CurseForge,Fabric,Forge,NeoForge,Quilt,跨平台,云存档,皮肤中心' },
        { name: 'author', content: 'QookiX' },
        { name: 'theme-color', content: '#e89a4b' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'QookiX Launcher' },
        { property: 'og:title', content: 'QookiX Launcher — 跨平台 Minecraft 启动器' },
        { property: 'og:description', content: '基于 Tauri 的跨平台 Minecraft 启动器，纯净、轻量、无广告。双源模组一键安装，云存档同步。' },
        { property: 'og:url', content: 'https://www.qookix.cn/' },
        { property: 'og:image', content: 'https://www.qookix.cn/preview-1.png' },
        { property: 'og:locale', content: 'zh_CN' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'QookiX Launcher — 跨平台 Minecraft 启动器' },
        { name: 'twitter:description', content: '基于 Tauri 的跨平台 Minecraft 启动器，纯净、轻量、无广告。' },
        { name: 'twitter:image', content: 'https://www.qookix.cn/preview-1.png' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.qookix.cn/' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&display=swap'
        }
      ],
      script: [
        {
          innerHTML: "(function(){try{var t=localStorage.getItem('qookix-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          tagPosition: 'head'
        }
      ]
    }
  },
  nitro: {
    prerender: {

      crawlLinks: false
    }
  }
})