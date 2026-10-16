<template>
  <section id="top" class="hero">
    <div class="container">
      <div class="board fade-up">
        <div class="panel">
          <h1 class="title"><span class="brand">QookiX</span><br>Launcher</h1>
          <p class="desc">方块之旅由此开始。跨平台 Minecraft 启动器，纯净、轻量、无广告。</p>
          <div class="actions">
            <a href="#download" class="btn btn-primary">
              <Download :size="18" />
              免费下载
            </a>
            <a href="https://docs.qookix.cn" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">查看文档</a>
          </div>
        </div>

        <div class="shot-wrap">
          <div class="shot-tile">
            <img
              v-for="shot in shots"
              :key="shot.id"
              :src="`/preview-${shot.id}.png`"
              :alt="`QookiX ${shot.label}`"
              class="shot"
              :class="{ active: currentShot === shot.id }"
              loading="lazy"
            />
          </div>
          <div class="shot-switch">
            <button
              v-for="shot in shots"
              :key="shot.id"
              class="switch-btn"
              :class="{ active: currentShot === shot.id }"
              @click="currentShot = shot.id"
            >
              {{ shot.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download } from 'lucide-vue-next'

const shots = [
  { id: 1, label: '主界面' },
  { id: 2, label: '内容中心' },
  { id: 3, label: '实例中心' }
]
const currentShot = ref(1)
</script>

<style scoped>
.hero {
  padding-top: 120px;
  padding-bottom: 80px;
}
.board {
  background: var(--tile);
  border-radius: var(--radius);
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 0;
  align-items: stretch;
}
@media (max-width: 860px) {
  .board { grid-template-columns: 1fr; }
  .hero { padding-top: 90px; }
}

.panel {
  padding: 56px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}
.title {
  font-size: var(--fs-hero);
  line-height: 1.05;
}
.brand {
  color: var(--accent);
}
.desc {
  color: var(--fg);
  font-size: var(--fs-body);
  line-height: 1.7;
  max-width: 36ch;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.shot-wrap {
  display: flex;
  flex-direction: column;
}
.shot-tile {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1202 / 782;
}
.shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 400ms var(--ease);
}
.shot.active { opacity: 1; }

.shot-switch {
  display: flex;
}
.switch-btn {
  flex: 1;
  padding: 14px 20px;
  background: var(--surface);
  color: var(--fg);
  font-size: var(--fs-body);
  font-weight: 600;
  border-radius: 0;
  transition: background 200ms var(--ease), color 200ms var(--ease);
}
.switch-btn:hover { background: var(--tile); }
.switch-btn.active {
  background: var(--accent);
  color: var(--accent-contrast);
}

@media (max-width: 480px) {
  .panel { padding: 32px 24px; gap: 20px; }
  .title { font-size: 2rem; }
  .desc { font-size: 1rem; }
  .switch-btn { padding: 12px 14px; }
}

@media (prefers-reduced-motion: reduce) {
  .shot { transition: none; }
}
</style>