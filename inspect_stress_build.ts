import fs from 'fs'
import path from 'path'
import { build } from './packages/fte.js/src/utils/build'

const src = path.join(__dirname, 'demo')
const dest = path.join(__dirname, 'tmp', 'stress-inspect')
fs.rmSync(dest, { recursive: true, force: true })
fs.mkdirSync(dest, { recursive: true })

await new Promise<void>((resolve, reject) => {
  build(
    src,
    dest,
    {
      typescript: false,
      format: 'cjs' as any,
      pretty: false,
      minify: false,
      standalone: false,
      single: false,
      ext: '.njs',
      file: 'index',
      sourcemap: true,
      inlineMap: false,
    } as any,
    (err) => {
      if (err) reject(err as Error)
      else resolve()
    },
  )
})

function collect(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collect(full)
    } else {
      console.log(full)
    }
  }
}

collect(dest)
