<template>
  <section id="features" class="section">
    <div class="container">
      <div class="section-head">
        <h2>该有的都有</h2>
      </div>

      <div class="board">
        <article v-for="f in features" :key="f.title" class="tile fade-up" :class="f.cls">
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </article>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { title: '双源内容中心', desc: 'Modrinth + CurseForge，模组、整合包、光影、资源包一键安装，搜索过滤、版本兼容自动检测。', cls: 'w7' },
  { title: '皮肤中心', desc: '3D 预览，披风、经典与纤细模型，按玩家名获取，本地缓存。', cls: 'w5' },
  { title: '极致轻量', desc: 'Tauri 2 + Rust 内核，安装包 6 MB，内存占用低，启动快。', cls: 'w4' },
  { title: '云存档同步', desc: '基于 GitHub 私有仓库，跨设备同步存档、配置与模组列表。', cls: 'w4' },
  { title: '工具箱', desc: '种子地图、皮肤编辑器、资源翻译、存档管理。', cls: 'w4' },
  { title: '多账号管理', desc: '微软正版、离线、外置登录统一管理，一键切换，令牌加密存储于系统钥匙串。', cls: 'w6' },
  { title: '版本隔离', desc: '每个实例独立 JVM 参数、模组目录、游戏版本，互不干扰，删除即清理干净。', cls: 'w6' },
  { title: '游戏优化', desc: '内存自动分配，JVM 参数调优，启动加速，FPS 优化建议。', cls: 'w4' },
  { title: '主题自定义', desc: '亮色、暗色、自定义主题色，跟随系统切换，支持自定义背景。', cls: 'w4' },
  { title: '自动更新', desc: '启动时自动检查新版本，一键升级，增量更新包体积极小。', cls: 'w4' }
]
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 8px;
}
.tile {
  background: var(--tile);
  border-radius: var(--radius);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background 200ms var(--ease);
}
.tile:hover { background: var(--surface); }
.tile h3 { font-size: 1.15rem; }
.tile p {
  color: var(--fg);
  font-size: var(--fs-body);
  line-height: 1.6;
  max-width: 52ch;
}


.w4 { grid-column: span 4; }
.w5 { grid-column: span 5; }
.w6 { grid-column: span 6; }
.w7 { grid-column: span 7; }
.w12 { grid-column: span 12; }

@media (max-width: 860px) {
  .board { grid-template-columns: repeat(12, 1fr); }
  .w4 { grid-column: span 12; }
  .w5 { grid-column: span 6; }
  .w6 { grid-column: span 12; }
  .w7 { grid-column: span 12; }
  .w12 { grid-column: span 12; }
}
@media (max-width: 560px) {
  .board { grid-template-columns: 1fr; gap: 0; }
  .w4, .w5, .w6, .w7, .w12 { grid-column: span 1; }
  .tile { background: none; padding: 22px 0; }
  .tile:hover { background: none; }
  .tile h3 { font-size: 1.1rem; }
}
</style>