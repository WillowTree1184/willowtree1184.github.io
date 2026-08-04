export function preloadImage(src: string): Promise<void> {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            if ('decode' in img) {
                img.decode().then(() => resolve()).catch(() => resolve())
            } else {
                resolve()
            }
        }
        img.onerror = () => resolve()
    })
}

/**
 * 从当前页面自动收集所有图片 URL
 * 来源：1) Performance API 已请求资源 2) DOM <img> 3) CSS background-image
 */
function collectImageUrls(): string[] {
    const urls = new Set<string>()
    const addUrl = (url: string) => {
        if (!url || url.startsWith('data:')) return
        try {
            urls.add(new URL(url, location.href).href) // 统一转为绝对路径去重
        } catch {
            urls.add(url)
        }
    }

    // 1. 浏览器已发起的图片请求（最可靠，能捕获 CSS 背景图、JS 动态创建的图片等）
    try {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
        entries.forEach(entry => {
            const isImage = entry.initiatorType === 'img' 
                || entry.initiatorType === 'css-image'
                || /\.(jpg|jpeg|png|gif|webp|svg|avif|ico)(\?.*)?$/i.test(entry.name)
            if (isImage) addUrl(entry.name)
        })
    } catch { /* ignore */ }

    // 2. DOM 中 <img> 标签（包含 Vue 渲染后的）
    document.querySelectorAll('img').forEach(img => {
        if (img.src) addUrl(img.src)
        // 可选：解析 srcset（取所有候选 URL）
        if (img.srcset) {
            img.srcset.split(',').forEach(s => {
                const src = s.trim().split(' ')[0]
                if (src) addUrl(src)
            })
        }
    })

    // 3. 内联 style 和 CSS 规则中的 background-image
    const extractUrls = (cssValue: string) => {
        if (!cssValue || cssValue === 'none') return []
        const matches: string[] = []
        
        // 更清晰的写法
        for (const match of cssValue.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
            matches.push(match[1] as string)
        }
        
        return matches
    }

    // 内联 style
    document.querySelectorAll('[style*="background-image"]').forEach(el => {
        extractUrls((el as HTMLElement).style.backgroundImage).forEach(addUrl)
    })

    // 样式表规则（跨域 CSS 会报错，用 try-catch 跳过）
    try {
        Array.from(document.styleSheets).forEach(sheet => {
            Array.from(sheet.cssRules || []).forEach(rule => {
                if (rule instanceof CSSStyleRule) {
                    extractUrls(rule.style.backgroundImage).forEach(addUrl)
                    extractUrls(rule.style.listStyleImage).forEach(addUrl)
                }
            })
        })
    } catch { /* SecurityError: 跨域样式表无法访问 */ }

    return Array.from(urls)
}

/** 无需传入 urls，自动发现并预加载页面所有图片 */
export function preloadImages(): Promise<void[]> {
    const urls = collectImageUrls()
    return Promise.all(urls.map(preloadImage))
}

export function preloadFonts(): Promise<void> {
    return document.fonts.ready.then(() => undefined)
}

export function waitForWindowLoad(): Promise<void> {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve()
        } else {
            window.addEventListener('load', () => resolve(), { once: true })
        }
    })
}