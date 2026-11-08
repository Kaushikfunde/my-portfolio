import { readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const distIndex = path.join(root, 'dist', 'index.html')
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js')
const rootTag = '<div id="root"></div>'

const { render } = await import(pathToFileURL(serverEntry).href)
const appHtml = render()

let doc = await readFile(distIndex, 'utf8')

if (!doc.includes(rootTag)) {
  throw new Error(`Could not find ${rootTag} in dist/index.html`)
}

doc = doc.replace(rootTag, `<div id="root">${appHtml}</div>`)
await writeFile(distIndex, doc, 'utf8')
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })

console.log(`Prerendered homepage HTML: ${appHtml.length} characters`)
