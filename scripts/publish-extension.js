#!/usr/bin/env node

const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const rootDir = path.resolve(__dirname, '..')
const extensionDir = path.resolve(rootDir, 'packages', 'vscode-ftejs-lang')

function parseOptions(args) {
  const options = {
    vsce: true,
    openvsx: true,
    dryRun: false,
    help: false,
    forwardArgs: [],
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]

    switch (arg) {
      case '--vsce-only':
        options.vsce = true
        options.openvsx = false
        break
      case '--openvsx-only':
        options.vsce = false
        options.openvsx = true
        break
      case '--skip-vsce':
        options.vsce = false
        break
      case '--skip-openvsx':
        options.openvsx = false
        break
      case '--dry-run':
        options.dryRun = true
        break
      case '--help':
      case '-h':
        options.help = true
        break
      case '--':
        options.forwardArgs.push(...args.slice(i + 1))
        i = args.length
        break
      default:
        options.forwardArgs.push(arg)
        break
    }
  }

  return options
}

function showHelp() {
  console.log(`Publish the VS Code extension to the marketplaces.

Usage: node scripts/publish-extension.js [options] [-- extra args]

Options:
  --vsce-only        Publish only to the VS Code Marketplace
  --openvsx-only     Publish only to the Open VSX Registry
  --skip-vsce        Skip the VS Code Marketplace step
  --skip-openvsx     Skip the Open VSX step
  --dry-run          Print the commands without executing them
  -h, --help         Show this help message

All additional args (including positional ones) are forwarded to both publish commands.
`)
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`⚡ Running: ${command} ${args.join(' ')}`)

    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

async function main() {
  if (!fs.existsSync(extensionDir)) {
    console.error('❌ VS Code extension directory not found:', extensionDir)
    process.exit(1)
  }

  const options = parseOptions(process.argv.slice(2))

  if (options.help) {
    showHelp()
    return
  }

  if (!options.vsce && !options.openvsx) {
    console.error('❌ Nothing to publish. Enable at least one target.')
    process.exit(1)
  }

  const targets = []

  if (options.vsce) {
    targets.push({
      label: 'VS Code Marketplace',
      script: 'publish:vsce',
    })
  }

  if (options.openvsx) {
    targets.push({
      label: 'Open VSX Registry',
      script: 'publish:openvsx',
    })
  }

  for (const target of targets) {
    const npmArgs = ['--prefix', extensionDir, 'run', target.script]

    if (options.forwardArgs.length > 0) {
      npmArgs.push('--', ...options.forwardArgs)
    }

    if (options.dryRun) {
      console.log(`[dry-run] npm ${npmArgs.join(' ')}`)
      continue
    }

    console.log(`🚀 Publishing extension to ${target.label}...`)
    await runCommand('npm', npmArgs)
  }

  console.log('✅ Extension publish steps finished.')
}

main().catch((error) => {
  console.error('❌ Extension publish failed:', error.message)
  process.exit(1)
})
