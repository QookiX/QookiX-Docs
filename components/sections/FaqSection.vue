<template>
  <section id="faq" class="section alt">
    <div class="container">
      <div class="board">
        <div class="sticky-head">
          <h2>常见问题</h2>
        </div>

        <div class="accordion">
          <details
            v-for="(item, i) in faqs"
            :key="i"
            class="tile fade-up"
            :open="i === 0"
          >
            <summary class="faq-q">
              <span>{{ item.q }}</span>
              <Plus :size="18" class="q-icon" />
            </summary>
            <div class="faq-a">{{ item.a }}</div>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

const faqs = [
  {
    q: '免费开源吗？',
    a: '免费、开源，GPL-3.0 协议。源码在 GitHub，不含广告与遥测，任何人都可以审查和贡献代码。'
  },
  {
    q: '需要自己装 Java 吗？',
    a: '不需要，会自动下载匹配的 Java 运行时。也可以在设置里手动指定已有的 Java 路径。'
  },
  {
    q: '从其他启动器迁移麻烦吗？',
    a: '支持导入 HMCL、PCL2、Prism Launcher 的实例，选目录即可一键迁移，模组和配置都会保留。'
  },
  {
    q: '便携版和安装版区别？',
    a: '功能完全一样。便携版解压即用，配置存程序同目录，适合 U 盘携带；安装版注册快捷方式和文件关联，更新更方便。'
  },
  {
    q: '存档云同步怎么用？',
    a: '在设置里绑定 GitHub 私有仓库，选择要同步的实例和存档，启动器会自动上传和拉取。不依赖任何第三方服务器。'
  },
  {
    q: '遇到问题怎么办？',
    a: '先阅读官方文档，在社区群可以交流，还可以在 GitHub Issues 提交反馈。'
  }
]
</script>

<style scoped>
.alt { background: var(--surface); padding-bottom: 120px; }
.board {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 8px;
}
@media (max-width: 860px) { .board { grid-template-columns: 1fr; } }

.sticky-head {
  align-self: start;
}
.sticky-head h2 { font-size: var(--fs-h1); }

.accordion { display: flex; flex-direction: column; gap: 8px; }

.tile {
  background: var(--tile);
  border-radius: var(--radius);
  overflow: hidden;
}
.tile[open] { background: var(--surface); }

.faq-q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--fg);
  cursor: pointer;
  list-style: none;
}
.faq-q::-webkit-details-marker { display: none; }
.q-icon {
  flex: none;
  color: var(--accent);
  transition: transform 300ms var(--ease);
}
.tile[open] .q-icon { transform: rotate(45deg); }

.faq-a {
  padding: 0 24px 20px;
  color: var(--fg);
  font-size: var(--fs-body);
  line-height: 1.75;
  max-width: 60ch;
}

@media (max-width: 480px) {
  .faq-q { padding: 16px 18px; font-size: var(--fs-sm); gap: 12px; }
  .faq-a { padding: 0 18px 16px; font-size: var(--fs-sm); }
  .sticky-head { position: static; }
}
</style>