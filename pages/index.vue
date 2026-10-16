<template>
  <div>
    <HeroSection />
    <FeatureSection />

    <WhySection />
    <DownloadSection />
    <ChangelogSection />
    <FaqSection />
  </div>
</template>
<script setup lang="ts">
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'QookiX Launcher',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Windows, macOS, Linux',
      description: '基于 Tauri 的跨平台 Minecraft 启动器，纯净、轻量、无广告。支持 Fabric/Forge/NeoForge/Quilt，Modrinth + CurseForge 双源模组一键安装，云存档同步。',
      url: 'https://www.qookix.cn/',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
      featureList: [
        '双源模组一键安装',
        '多账号管理',
        '版本隔离',
        '云存档同步',
        '皮肤中心',
        '工具箱'
      ]
    })
  }]
})
</script>