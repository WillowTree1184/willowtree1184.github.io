import sharp from 'sharp'
import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MAX_WIDTH = 1200
const QUALITY = 82

async function postBuild() {
  const files = await glob(['dist/**/*.{webp,png,jpg,jpeg}'])
  let processed = 0
  let saved = 0

  for (const file of files) {
    const img = sharp(file)
    const meta = await img.metadata()

    if (meta.width <= MAX_WIDTH && file.endsWith('.webp')) continue

    console.log(`🔨 ${path.relative('dist', file)}: ${meta.width}×${meta.height}`)

    const tmp = file + '.tmp'

    if (file.endsWith('.webp')) {
      await img
        .resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(tmp)
    } else if (file.endsWith('.png')) {
      await img
        .resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' })
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(tmp)
    } else {
      await img
        .resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' })
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
        .toFile(tmp)
    }

    const oldSize = fs.statSync(file).size
    fs.renameSync(tmp, file)
    const newSize = fs.statSync(file).size
    saved += oldSize - newSize
    processed++
  }

  if (processed) {
    console.log(`\n✅ 处理 ${processed} 张，节省 ${(saved / 1024 / 1024).toFixed(1)} MB`)
  } else {
    console.log('✅ 所有图片尺寸合格，无需处理')
  }
}

postBuild().catch(err => {
  console.error(err)
  process.exit(1)
})