// postbuild.js
import fs from 'fs-extra'
import { readdirSync } from 'fs'
import path from 'path'

const distDir = 'dist/assets'
const outputDir = '../assets'

// Copy index.html
fs.ensureDirSync(outputDir)
fs.copyFileSync('dist/index.html', path.join(outputDir, 'index.html'))

// Find hashed JS and CSS files
const files = readdirSync(distDir)
const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'))
const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'))

// Copy to standard filenames
fs.copyFileSync(path.join(distDir, jsFile), path.join(outputDir, 'index.js'))
fs.copyFileSync(path.join(distDir, cssFile), path.join(outputDir, 'index.css'))
