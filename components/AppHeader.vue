<template>
  <header class="header" :class="{ scrolled }">
    <div class="inner container">
      <a href="#top" class="logo" aria-label="Qookix 首页">
        <img src="/logo.png" alt="QookiX" class="logo-img" />
        <span class="logo-text">QookiX</span>
      </a>

      <nav class="nav" :class="{ open: menuOpen }">
        <a v-for="item in navItems" :key="item.href" :href="item.href" class="nav-link" @click="closeMenu">
          {{ item.label }}
        </a>
        <button class="theme-toggle" :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" :size="18" />
          <Moon v-else :size="18" />
        </button>
        <a href="https://docs.qookix.cn" class="btn btn-secondary nav-action" target="_blank" rel="noopener noreferrer" @click="closeMenu">文档</a>
        <a href="#download" class="btn btn-primary cta" @click="closeMenu">下载</a>
      </nav>

      <button class="menu-btn" :aria-expanded="menuOpen" aria-label="菜单" @click="menuOpen = !menuOpen">
        <span /><span /><span />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '~/composables/useTheme'

const { theme, toggleTheme } = useTheme()

const navItems = [
  { href: '#features', label: '功能' },

  { href: '#changelog', label: '更新日志' },
  { href: '#faq', label: '常见问题' }
]

const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}
function closeMenu() {
  menuOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: transparent;
  transition: background 300ms var(--ease);
}
.header.scrolled {
  background: var(--bg);
}
.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 14px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--fg);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}
.logo:hover { color: var(--fg); }
.logo-img {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  object-fit: contain;
  flex: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav-link {
  padding: 8px 14px;
  border-radius: var(--radius);
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: color 200ms var(--ease), background 200ms var(--ease);
}
.nav-link:hover {
  color: var(--fg);
  background: var(--surface);
}

.theme-toggle {
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-muted);
  transition: color 200ms var(--ease), background 200ms var(--ease);
}
.theme-toggle:hover {
  color: var(--accent);
  background: var(--surface);
}

.nav-action { margin-left: 6px; }
.cta { margin-left: 6px; }

.menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.menu-btn span {
  width: 20px;
  height: 2px;
  background: var(--fg);
  border-radius: 2px;
  transition: transform 220ms var(--ease), opacity 220ms var(--ease);
}

@media (max-width: 860px) {
  .menu-btn { display: flex; }
  .nav {
    position: fixed;
    top: 60px;
    left: 16px;
    right: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 16px;
    border-radius: var(--radius);
    background: var(--tile);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-12px);
    transition: opacity 240ms var(--ease), transform 240ms var(--ease);
  }
  .nav.open { opacity: 1; pointer-events: auto; transform: translateY(0); }
  .nav-link { padding: 12px 14px; font-size: var(--fs-body); }
  .nav-action { margin-left: 0; justify-content: center; }
  .cta { margin-left: 0; margin-top: 6px; }
}
</style>