import { onMounted, onBeforeUnmount } from 'vue'

export function useReveal() {
  let observer: IntersectionObserver | null = null
  const observed = new WeakSet<Element>()

  function register(el: Element) {
    if (observed.has(el) || !observer) return
    observed.add(el)
    observer.observe(el)
  }

  function scan(root: ParentNode = document) {
    const els = root.querySelectorAll('.fade-up')
    els.forEach((el) => register(el))
  }

  function applyStagger() {
    const groups = new Map<Element, Element[]>()
    document.querySelectorAll('.fade-up').forEach((el) => {
      const parent = el.parentElement
      if (!parent) return
      const arr = groups.get(parent) || []
      arr.push(el)
      groups.set(parent, arr)
    })
    groups.forEach((arr) => {
      arr.forEach((el, i) => {
        if (arr.length > 1) (el as HTMLElement).style.transitionDelay = `${i * 80}ms`
      })
    })
  }

  let mutationObserver: MutationObserver | null = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('is-visible'))
      return
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    applyStagger()
    scan()

    mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return
          if ((node as Element).classList?.contains('fade-up')) register(node as Element)
          scan(node as ParentNode)
        })
      }
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    mutationObserver?.disconnect()
  })
}