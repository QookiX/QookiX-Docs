import { ref, onMounted, watch } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')
let initialized = false

function applyTheme(value: Theme) {
  if (import.meta.client) {
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem('qookix-theme', value)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', value === 'dark' ? '#0c0a09' : '#e89a4b')
  }
}

function detectInitial(): Theme {
  if (import.meta.client) {
    const stored = localStorage.getItem('qookix-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export function useTheme() {
  if (!initialized) {
    initialized = true

  }

  onMounted(() => {
    theme.value = detectInitial()
    applyTheme(theme.value)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('qookix-theme')) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    }
    mq.addEventListener('change', onChange)
  })

  watch(theme, (value) => applyTheme(value))

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}