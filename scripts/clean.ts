#!/usr/bin/env bun

import { rmSync } from 'node:fs'

/**
 * Clean script that removes specified files and directories using glob patterns
 */

const DEFAULT_PATTERNS = [
  './node_modules',
  '**/dist',
  '**/build',
  '**/node_modules',
  '**/yarn-error.log',
  '**/yarn.lock',
  '**/tsconfig.tsbuildinfo',
  '**/package-lock.json',
  '**/bun.lockb',
  '**/bun.lock',
]

interface CleanOptions {
  patterns?: string[]
  dryRun?: boolean
  verbose?: boolean
  force?: boolean
}

class FileCleaner {
  private options: CleanOptions

  constructor(options: CleanOptions = {}) {
    this.options = {
      patterns: DEFAULT_PATTERNS,
      dryRun: false,
      verbose: false,
      force: false,
      ...options,
    }
  }

  async clean(): Promise<void> {
    const patterns = this.options.patterns || DEFAULT_PATTERNS

    console.log('🧹 Starting cleanup process...')

    if (this.options.dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be deleted')
    }

    let totalDeleted = 0
    let totalSize = 0

    for (const pattern of patterns) {
      try {
        const matchesIterator = new Bun.Glob(pattern).scan({
          cwd: process.cwd(),
          absolute: true,
          dot: true,
        })

        const matches: string[] = []
        for await (const match of matchesIterator) {
          if (
            match.includes('/.git/') ||
            (match.includes('/.') &&
              !match.match(/\/(node_modules|dist|build|bun\.lock|yarn\.lock)$/))
          ) {
            continue
          }
          matches.push(match)
        }

        if (matches.length === 0) {
          if (this.options.verbose) {
            console.log(`⏭️  No matches for pattern: ${pattern}`)
          }
          continue
        }

        console.log(`📁 Pattern: ${pattern} (${matches.length} matches)`)

        for (const match of matches) {
          try {
            const stats = await Bun.file(match).exists()

            if (!stats) {
              if (this.options.verbose) {
                console.log(`⏭️  Skipping non-existent: ${match}`)
              }
              continue
            }

            if (this.options.dryRun) {
              console.log(`🔍 Would delete: ${match}`)
            } else {
              try {
                const stat = await Bun.file(match).stat()
                if (stat) {
                  totalSize += stat.size || 0
                }
              } catch {
                // Ignore stat errors, just delete
              }

              rmSync(match, {
                recursive: true,
                force: this.options.force,
              })

              totalDeleted++

              if (this.options.verbose) {
                console.log(`🗑️  Deleted: ${match}`)
              }
            }
          } catch (error) {
            console.error(`❌ Error processing ${match}:`, error)
          }
        }
      } catch (error) {
        console.error(`❌ Error with pattern ${pattern}:`, error)
      }
    }

    if (this.options.dryRun) {
      console.log('🔍 DRY RUN COMPLETE - No files were actually deleted')
    } else {
      console.log('✅ Cleanup complete!')
      console.log(`📊 Deleted ${totalDeleted} items`)
      if (totalSize > 0) {
        const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2)
        console.log(`💾 Freed up approximately ${sizeInMB} MB`)
      }
    }
  }
}

// Parse command line arguments
function parseArgs(): CleanOptions {
  const args = process.argv.slice(2)
  const options: CleanOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case '--dry-run':
      case '-n':
        options.dryRun = true
        break
      case '--verbose':
      case '-v':
        options.verbose = true
        break
      case '--force':
      case '-f':
        options.force = true
        break
      case '--patterns':
      case '-p':
        if (i + 1 < args.length) {
          options.patterns = args[i + 1].split(',').map((p) => p.trim())
          i++
        }
        break
      case '--help':
      case '-h':
        printHelp()
        process.exit(0)
        break
      default:
        console.error(`Unknown argument: ${arg}`)
        printHelp()
        process.exit(1)
    }
  }

  return options
}

function printHelp(): void {
  console.log(`
🧹 Clean Script - Remove files and directories using glob patterns

Usage: bun run scripts/clean.ts [options]

Options:
  -n, --dry-run     Show what would be deleted without actually deleting
  -v, --verbose     Show detailed output
  -f, --force       Force deletion (ignore errors)
  -p, --patterns    Comma-separated list of glob patterns to clean
  -h, --help        Show this help message

Examples:
  bun run scripts/clean.ts                    # Clean with default patterns
  bun run scripts/clean.ts --dry-run          # See what would be deleted
  bun run scripts/clean.ts --verbose          # Show detailed output
  bun run scripts/clean.ts --patterns "dist,*.log"  # Custom patterns

Default patterns:
  - ./node_modules
  - **/dist
  - **/build
  - **/node_modules
  - **/yarn-error.log
  - **/yarn.lock
  - **/tsconfig.tsbuildinfo
  - **/package-lock.json
  - **/bun.lockb
  - **/bun.lock
`)
}

// Main execution
async function main(): Promise<void> {
  try {
    const options = parseArgs()
    const cleaner = new FileCleaner(options)
    await cleaner.clean()
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

if (import.meta.main) {
  main()
}
