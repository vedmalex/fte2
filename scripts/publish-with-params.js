#!/usr/bin/env node

/**
 * Enhanced Lerna Publish with Parameters
 *
 * Этот скрипт предоставляет расширенные возможности для публикации пакетов через Lerna
 * с поддержкой различных параметров и автоматической подготовкой зависимостей.
 *
 * Возможности:
 * - Публикация конкретных версий
 * - Canary релизы с автогенерацией версий
 * - Поддержка кастомных registry и dist-tag
 * - Автоматическая подготовка зависимостей через dependency-compatibility-manager
 * - Интерактивный и неинтерактивный режимы
 */

const { spawn, execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

class LernaPublisher {
  constructor() {
    this.args = process.argv.slice(2)
    this.options = this.parseArgs()
    this.rootDir = process.cwd()
    this.lernaConfig = this.loadLernaConfig()
  }

  /**
   * Парсинг аргументов командной строки
   */
  parseArgs() {
    const options = {
      version: null,
      forcePublish: false,
      canary: false,
      preid: null,
      registry: null,
      distTag: null,
      yes: false,
      dryRun: false,
      help: false,
    }

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i]

      switch (arg) {
        case '--force-publish':
        case '--force':
          options.forcePublish = true
          break
        case '--canary':
          options.canary = true
          break
        case '--preid':
          options.preid = this.args[++i] || 'alpha'
          break
        case '--registry':
          options.registry = this.args[++i]
          break
        case '--dist-tag':
        case '--tag':
          options.distTag = this.args[++i] || 'latest'
          break
        case '--yes':
        case '-y':
          options.yes = true
          break
        case '--dry-run':
          options.dryRun = true
          break
        case '--help':
        case '-h':
          options.help = true
          break
        default:
          // Если аргумент не начинается с --, считаем его версией
          if (!arg.startsWith('--') && !options.version) {
            options.version = arg
          }
      }
    }

    if (options.canary) {
      options.forcePublish = true
    }

    return options
  }

  /**
   * Загружает конфигурацию Lerna
   */
  loadLernaConfig() {
    try {
      const lernaConfigPath = path.join(this.rootDir, 'lerna.json')
      if (fs.existsSync(lernaConfigPath)) {
        return JSON.parse(fs.readFileSync(lernaConfigPath, 'utf8'))
      }
    } catch (error) {
      console.warn('⚠️  Could not load lerna.json:', error.message)
    }
    return {}
  }

  /**
   * Показывает справку
   */
  showHelp() {
    console.log(`
🚀 Enhanced Lerna Publisher with Parameters

Usage: node scripts/publish-with-params.js [version] [options]

Arguments:
  version              Specific version to publish (e.g., "1.2.3", "1.2.3-beta.1")

Options:
  --force-publish      Force publish all packages regardless of changes
  --canary            Create a canary release with git sha
  --preid <id>        Prerelease identifier (default: "alpha")
  --registry <url>    Custom npm registry URL
  --dist-tag <tag>    Distribution tag (default: "latest")
  --yes               Skip all confirmation prompts
  --dry-run           Show what would be published without doing it
  --help              Show this help message

Examples:
  # Publish specific version
  node scripts/publish-with-params.js 1.2.3

  # Force publish specific version
  node scripts/publish-with-params.js 1.2.3 --force-publish

  # Canary release
  node scripts/publish-with-params.js --canary

  # Publish with custom registry and tag
  node scripts/publish-with-params.js 1.2.3 --registry https://npm.example.com --dist-tag beta

  # Prerelease with custom identifier
  node scripts/publish-with-params.js --preid rc

Environment Variables:
  NPM_TOKEN           NPM authentication token
  GITHUB_TOKEN        GitHub token for releases

Note: This script automatically prepares dependencies for Lerna compatibility.
`)
  }

  /**
   * Получает текущую версию из git
   */
  getCurrentVersion() {
    try {
      return this.lernaConfig.version || '0.1.0'
    } catch (error) {
      return '0.1.0'
    }
  }

  /**
   * Генерирует canary версию на основе git commit
   */
  generateCanaryVersion() {
    try {
      let currentVersion = this.getCurrentVersion()
      // Удаляем существующий prerelease или canary из текущей версии, если он есть
      const prereleaseIndex = currentVersion.indexOf('-')
      if (prereleaseIndex !== -1) {
        currentVersion = currentVersion.substring(0, prereleaseIndex)
      }
      const gitSha = execSync('git rev-parse --short HEAD', {
        encoding: 'utf8',
      }).trim()
      return `${currentVersion}-canary.${gitSha}`
    } catch (error) {
      console.error('❌ Could not generate canary version:', error.message)
      return `${this.getCurrentVersion()}-canary.unknown`
    }
  }

  /**
   * Генерирует prerelease версию
   */
  generatePrereleaseVersion() {
    let currentVersion = this.getCurrentVersion()
    const preid = this.options.preid || 'alpha'

    // Удаляем существующий prerelease из текущей версии, если он есть
    const prereleaseIndex = currentVersion.indexOf('-')
    if (prereleaseIndex !== -1) {
      currentVersion = currentVersion.substring(0, prereleaseIndex)
    }

    // Пытаемся получить следующий номер prerelease
    try {
      const tags = execSync('git tag --sort=-version:refname', {
        encoding: 'utf8',
      })
        .split('\n')
        .filter((tag) => tag.includes(`-${preid}`))
        .map((tag) => {
          const match = tag.match(new RegExp(`${preid}\\.(\\d+)`))
          return match ? Number.parseInt(match[1]) : 0
        })

      const nextNumber = tags.length > 0 ? Math.max(...tags) + 1 : 1
      return `${currentVersion}-${preid}.${nextNumber}`
    } catch (error) {
      return `${currentVersion}-${preid}.1`
    }
  }

  /**
   * Подготавливает зависимости для публикации
   */
  async prepareDependencies() {
    console.log('🔧 Preparing dependencies for Lerna publish...')

    try {
      // Запускаем dependency compatibility manager
      await this.runCommand('node', [
        'scripts/dependency-compatibility-manager.js',
        'backup-and-resolve',
      ])

      console.log('✅ Dependencies prepared successfully')
    } catch (error) {
      console.error('❌ Failed to prepare dependencies:', error.message)
      throw error
    }
  }

  /**
   * Восстанавливает зависимости после публикации
   */
  async restoreDependencies() {
    console.log('🔧 Restoring dependencies after publish...')

    try {
      await this.runCommand('node', [
        'scripts/dependency-compatibility-manager.js',
        'restore',
      ])

      console.log('✅ Dependencies restored successfully')
    } catch (error) {
      console.warn('⚠️  Failed to restore dependencies:', error.message)
      // Не прерываем процесс при ошибке восстановления
    }
  }

  /**
   * Создает git commit для публикации
   */
  async createGitCommit(version) {
    try {
      console.log(`📝 Creating git commit for version ${version}...`)

      const commitMessage = `chore: release v${version}`

      // Добавляем измененные файлы
      await this.runCommand('git', ['add', '.'])

      // Создаем коммит
      await this.runCommand('git', ['commit', '-m', commitMessage])

      console.log(`✅ Git commit created: ${commitMessage}`)
    } catch (error) {
      console.warn('⚠️  Could not create git commit:', error.message)
      // Не прерываем процесс при ошибке коммита
    }
  }

  /**
   * Создает git tag для релиза
   */
  async createGitTag(version) {
    try {
      console.log(`🏷️  Creating git tag for version ${version}...`)

      const tagName = `v${version}`

      // Создаем аннотированный тег
      await this.runCommand('git', [
        'tag',
        '-a',
        tagName,
        '-m',
        `Release v${version}`,
      ])

      console.log(`✅ Git tag created: ${tagName}`)
    } catch (error) {
      console.warn('⚠️  Could not create git tag:', error.message)
    }
  }

  /**
   * Определяет финальную версию для публикации
   */
  getFinalVersion() {
    if (this.options.canary) {
      return this.generateCanaryVersion()
    }

    if (this.options.preid) {
      return this.generatePrereleaseVersion()
    }

    return this.options.version || this.getCurrentVersion()
  }

  /**
   * Создает команду Lerna publish
   */
  buildLernaCommand() {
    const version = this.getFinalVersion()
    const command = ['publish']

    // Добавляем версию если указана
    if (version) {
      command.push(version)
    }

    // Добавляем параметры
    if (this.options.forcePublish) {
      command.push('--force-publish')
    }

    if (this.options.registry) {
      command.push('--registry', this.options.registry)
    }

    if (this.options.distTag) {
      command.push('--dist-tag', this.options.distTag)
    }

    if (this.options.yes) {
      command.push('--yes')
    }

    if (this.options.dryRun) {
      command.push('--dry-run')
    }

    // Добавляем prerelease параметры если нужно
    if (this.options.preid) {
      command.push('--preid', this.options.preid)
    }

    return command
  }

  /**
   * Запускает команду в дочернем процессе
   */
  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      console.log(`⚡ Running: ${command} ${args.join(' ')}`)

      const child = spawn(command, args, {
        cwd: this.rootDir,
        stdio: 'inherit',
        shell: true,
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

  /**
   * Основной процесс публикации
   */
  async publish() {
    try {
      // Показываем справку если запрошена
      if (this.options.help) {
        this.showHelp()
        return
      }

      const version = this.getFinalVersion()
      console.log('🚀 Starting enhanced Lerna publish...')
      console.log(`📦 Target version: ${version}`)
      console.log('🔧 Options:', this.options)

      // Подготавливаем зависимости
      await this.prepareDependencies()

      // Создаем команду Lerna
      const lernaCommand = this.buildLernaCommand()
      console.log(`📋 Lerna command: lerna ${lernaCommand.join(' ')}`)

      if (this.options.dryRun) {
        console.log(
          '🔍 DRY RUN - Would execute:',
          `lerna ${lernaCommand.join(' ')}`,
        )
        return
      }

      // Запускаем Lerna publish
      await this.runCommand('lerna', lernaCommand)

      // Создаем git commit если публикация успешна
      if (!this.options.dryRun && !this.options.canary) {
        await this.createGitCommit(version)
        await this.createGitTag(version)
      }

    } finally {
      // Всегда пытаемся восстановить зависимости
      try {
        await this.restoreDependencies()
      } catch (restoreError) {
        console.error(
          '❌ Failed to restore dependencies:',
          restoreError.message,
        )
      }
    }
  }
}

// Запуск если файл выполнен напрямую
if (require.main === module) {
  const publisher = new LernaPublisher()
  publisher.publish().catch((error) => {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  })
}

module.exports = LernaPublisher
