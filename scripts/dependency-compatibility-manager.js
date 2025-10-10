#!/usr/bin/env node

/**
 * Dependency Compatibility Manager for Bun + Lerna Integration
 *
 * Этот скрипт обеспечивает совместимость между:
 * - Bun catalog:* dependencies (Bun v1.2.16+)
 * - workspace:* dependencies (локальные пакеты)
 * - Lerna publish (не поддерживает catalog:* protocol)
 *
 * Usage:
 *   node scripts/dependency-compatibility-manager.js backup-and-resolve
 *   lerna publish
 *   node scripts/dependency-compatibility-manager.js restore
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

class DependencyCompatibilityManager {
  constructor() {
    this.backupFile = path.join(process.cwd(), '.dependency-backup.json')
    this.rootPackageJson = path.join(process.cwd(), 'package.json')
    this.lernaConfigFile = path.join(process.cwd(), 'lerna.json')
    this.workspacePatterns = ['apps/*/package.json', 'packages/*/package.json']

    this.catalogCache = new Map()
    this.lernaConfig = null
    this.backup = {
      timestamp: new Date().toISOString(),
      files: new Map(),
      catalogs: null,
      lernaConfig: null,
    }
  }

  /**
   * Загружает Lerna конфигурацию
   */
  async loadLernaConfig() {
    try {
      if (fs.existsSync(this.lernaConfigFile)) {
        this.lernaConfig = JSON.parse(
          fs.readFileSync(this.lernaConfigFile, 'utf8'),
        )
        console.log(
          '📋 Loaded Lerna config - version:',
          this.lernaConfig.version,
        )

        // Обновляем workspace patterns из Lerna конфигурации
        if (this.lernaConfig.packages) {
          this.workspacePatterns = Array.isArray(this.lernaConfig.packages)
            ? this.lernaConfig.packages.map((pattern) => {
              // Преобразуем packages/* в packages/*/package.json
              return pattern.endsWith('/*')
                ? `${pattern.slice(0, -2)}/*/package.json`
                : `${pattern}/package.json`
            })
            : [this.lernaConfig.packages.replace('/*', '/*/package.json')]
        }

        console.log('📂 Workspace patterns:', this.workspacePatterns.join(', '))
      } else {
        console.log('ℹ️  No lerna.json found, using default patterns')
      }
    } catch (error) {
      console.error('❌ Error loading lerna.json:', error.message)
      throw error
    }
  }

  /**
   * Загружает catalogs из root package.json
   */
  async loadCatalogs() {
    try {
      const rootPackage = JSON.parse(
        fs.readFileSync(this.rootPackageJson, 'utf8'),
      )

      if (rootPackage.workspaces?.catalog) {
        this.backup.catalogs = {
          catalog: rootPackage.workspaces.catalog,
          catalogs: rootPackage.workspaces.catalogs || {},
        }
        console.log('📦 Loaded catalogs from root package.json')
      } else {
        console.log('ℹ️  No catalogs found in root package.json')
      }
    } catch (error) {
      console.error('❌ Error loading root package.json:', error.message)
      throw error
    }
  }

  /**
   * Находит все package.json файлы в workspace
   */
  async findWorkspacePackages() {
    const packageFiles = []

    for (const pattern of this.workspacePatterns) {
      try {
        const files = execSync(
          `find . -name "package.json" -path "./${pattern}" -type f`,
          {
            encoding: 'utf8',
            cwd: process.cwd(),
          },
        )
          .trim()
          .split('\n')
          .filter(Boolean)

        packageFiles.push(...files)
      } catch (error) {
        // Игнорируем ошибки поиска для несуществующих паттернов
      }
    }

    return packageFiles
  }

  /**
   * Обрабатывает один package.json файл
   */
  async processPackageFile(packageFile) {
    try {
      const content = fs.readFileSync(packageFile, 'utf8')
      const packageData = JSON.parse(content)
      let modified = false

      // Сохраняем оригинал для backup
      this.backup.files.set(packageFile, content)

      // Обрабатываем зависимости
      const depsToProcess = [
        ...(packageData.dependencies
          ? Object.entries(packageData.dependencies)
          : []),
        ...(packageData.devDependencies
          ? Object.entries(packageData.devDependencies)
          : []),
        ...(packageData.peerDependencies
          ? Object.entries(packageData.peerDependencies)
          : []),
      ]

      for (const [depName, depVersion] of depsToProcess) {
        if (this.isCatalogDependency(depVersion)) {
          const resolvedVersion = await this.resolveCatalogDependency(
            depName,
            depVersion,
          )
          if (resolvedVersion && resolvedVersion !== depVersion) {
            // Обновляем зависимость
            if (packageData.dependencies && packageData.dependencies[depName]) {
              packageData.dependencies[depName] = resolvedVersion
            } else if (
              packageData.devDependencies &&
              packageData.devDependencies[depName]
            ) {
              packageData.devDependencies[depName] = resolvedVersion
            } else if (
              packageData.peerDependencies &&
              packageData.peerDependencies[depName]
            ) {
              packageData.peerDependencies[depName] = resolvedVersion
            }
            modified = true
            console.log(
              `🔄 ${packageFile}: ${depName}: ${depVersion} → ${resolvedVersion}`,
            )
          }
        } else if (this.isWorkspaceDependency(depVersion)) {
          const resolvedVersion = await this.resolveWorkspaceDependency(
            depName,
            packageFile,
          )
          if (resolvedVersion && resolvedVersion !== depVersion) {
            // Обновляем зависимость
            if (packageData.dependencies && packageData.dependencies[depName]) {
              packageData.dependencies[depName] = resolvedVersion
            } else if (
              packageData.devDependencies &&
              packageData.devDependencies[depName]
            ) {
              packageData.devDependencies[depName] = resolvedVersion
            } else if (
              packageData.peerDependencies &&
              packageData.peerDependencies[depName]
            ) {
              packageData.peerDependencies[depName] = resolvedVersion
            }
            modified = true
            console.log(
              `🔄 ${packageFile}: ${depName}: ${depVersion} → ${resolvedVersion}`,
            )
          }
        }
      }

      // Сохраняем изменения если были модификации
      if (modified) {
        fs.writeFileSync(
          packageFile,
          JSON.stringify(packageData, null, 2) + '\n',
        )
        console.log(`✅ Processed: ${packageFile}`)
      }
    } catch (error) {
      console.error(`❌ Error processing ${packageFile}:`, error.message)
      throw error
    }
  }

  /**
   * Проверяет, является ли зависимость catalog зависимостью
   */
  isCatalogDependency(version) {
    return typeof version === 'string' && version.startsWith('catalog:')
  }

  /**
   * Проверяет, является ли зависимость workspace зависимостью
   */
  isWorkspaceDependency(version) {
    return typeof version === 'string' && version.startsWith('workspace:')
  }

  /**
   * Разрешает catalog зависимость в конкретную версию
   */
  async resolveCatalogDependency(depName, catalogRef) {
    const catalogName = catalogRef.replace('catalog:', '')

    if (!this.backup.catalogs) {
      return null
    }

    // Ищем в основном каталоге
    if (this.backup.catalogs.catalog && this.backup.catalogs.catalog[depName]) {
      return this.backup.catalogs.catalog[depName]
    }

    // Ищем в именованных каталогах
    if (
      catalogName &&
      this.backup.catalogs.catalogs &&
      this.backup.catalogs.catalogs[catalogName]
    ) {
      const catalog = this.backup.catalogs.catalogs[catalogName]
      if (catalog[depName]) {
        return catalog[depName]
      }
    }

    return null
  }

  /**
   * Разрешает workspace зависимость в конкретную версию
   */
  async resolveWorkspaceDependency(depName, currentPackageFile) {
    try {
      // Используем версию из lerna.json как fallback
      if (this.lernaConfig?.version) {
        return this.lernaConfig.version
      }

      // Попытка найти локальный пакет
      const packageFiles = await this.findWorkspacePackages()
      for (const packageFile of packageFiles) {
        if (packageFile === currentPackageFile) continue

        try {
          const content = fs.readFileSync(packageFile, 'utf8')
          const packageData = JSON.parse(content)

          if (packageData.name === depName && packageData.version) {
            return packageData.version
          }
        } catch (error) {
          // Игнорируем ошибки парсинга
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Сохраняет backup файл
   */
  async saveBackup() {
    try {
      const backupData = {
        timestamp: this.backup.timestamp,
        files: Array.from(this.backup.files.entries()),
        catalogs: this.backup.catalogs,
        lernaConfig: this.backup.lernaConfig,
      }

      fs.writeFileSync(this.backupFile, JSON.stringify(backupData, null, 2))
    } catch (error) {
      console.error('❌ Error saving backup:', error.message)
      throw error
    }
  }

  /**
   * Основной метод для режима backup-and-resolve
   */
  async backupAndResolve() {
    console.log(
      '🔄 Starting Dependency Compatibility Manager - Backup & Resolve Mode',
    )

    try {
      // Загружаем конфигурацию
      await this.loadLernaConfig()
      await this.loadCatalogs()

      // Находим и обрабатываем пакеты
      const packageFiles = await this.findWorkspacePackages()
      console.log(`📦 Found ${packageFiles.length} workspace packages`)

      for (const packageFile of packageFiles) {
        await this.processPackageFile(packageFile)
      }

      // Сохраняем backup если были изменения
      if (this.backup.files.size > 0) {
        await this.saveBackup()
        console.log('✅ Backup and resolve completed successfully')
        console.log(`💾 Backup saved to: ${this.backupFile}`)
        console.log(`📦 Backed up ${this.backup.files.size} modified files`)
      } else {
        console.log('✅ Backup and resolve completed successfully')
        console.log(
          'ℹ️  No catalog:* or workspace:* dependencies found to process',
        )
      }

      console.log('🚀 Ready for lerna publish')
    } catch (error) {
      console.error('❌ Error during backup and resolve:', error.message)
      process.exit(1)
    }
  }

  /**
   * Основной метод для режима restore
   */
  async restore() {
    console.log('🔄 Starting Dependency Compatibility Manager - Restore Mode')

    try {
      if (!fs.existsSync(this.backupFile)) {
        console.log('ℹ️  No backup file found - nothing to restore')
        return
      }

      const backupData = JSON.parse(fs.readFileSync(this.backupFile, 'utf8'))

      console.log(`📦 Restoring ${backupData.files.length} files from backup`)
      console.log(`📅 Backup created: ${backupData.timestamp}`)

      for (const [filePath, originalContent] of backupData.files) {
        try {
          // Читаем текущее содержимое файла
          const currentContent = fs.readFileSync(filePath, 'utf8')
          const currentPackage = JSON.parse(currentContent)

          // Восстанавливаем оригинальное содержимое
          fs.writeFileSync(filePath, originalContent)

          // Сохраняем критические поля, которые могли быть изменены Lerna
          const originalPackage = JSON.parse(originalContent)

          // Сохраняем версию и gitHead если они были изменены
          if (currentPackage.version !== originalPackage.version) {
            console.log(
              `🔒 Preserved: ${filePath} version: ${originalPackage.version} → ${currentPackage.version}`,
            )
            originalPackage.version = currentPackage.version
          }

          if (currentPackage.gitHead && !originalPackage.gitHead) {
            console.log(
              `🔒 Preserved: ${filePath} gitHead: ${currentPackage.gitHead}`,
            )
            originalPackage.gitHead = currentPackage.gitHead
          }

          // Перезаписываем файл с сохраненными критическими полями
          fs.writeFileSync(
            filePath,
            JSON.stringify(originalPackage, null, 2) + '\n',
          )

          console.log(`✅ Restored: ${filePath}`)
        } catch (error) {
          console.error(`❌ Error restoring ${filePath}:`, error.message)
        }
      }

      console.log('✅ Restore completed successfully')

      // Удаляем backup файл после успешного восстановления
      try {
        fs.unlinkSync(this.backupFile)
        console.log('🗑️  Backup file removed')
      } catch (error) {
        console.warn('⚠️  Could not remove backup file:', error.message)
      }
    } catch (error) {
      console.error('❌ Error during restore:', error.message)
      process.exit(1)
    }
  }

  /**
   * Синхронизация версий с lerna.json
   */
  async syncVersions() {
    console.log(
      '🔄 Starting Dependency Compatibility Manager - Sync Versions Mode',
    )

    try {
      await this.loadLernaConfig()

      if (!this.lernaConfig?.version) {
        console.error('❌ No version found in lerna.json')
        process.exit(1)
      }

      const targetVersion = this.lernaConfig.version
      console.log(`📋 Target Lerna version: ${targetVersion}`)

      const packageFiles = await this.findWorkspacePackages()
      console.log(`📦 Found ${packageFiles.length} workspace packages`)

      let updatedCount = 0
      let correctCount = 0

      for (const packageFile of packageFiles) {
        try {
          const content = fs.readFileSync(packageFile, 'utf8')
          const packageData = JSON.parse(content)

          if (packageData.version !== targetVersion) {
            packageData.version = targetVersion
            fs.writeFileSync(
              packageFile,
              JSON.stringify(packageData, null, 2) + '\n',
            )
            console.log(
              `🔄 Updated: ${packageFile} (${packageData.version} → ${targetVersion})`,
            )
            updatedCount++
          } else {
            console.log(`✅ Correct: ${packageFile} (${packageData.version})`)
            correctCount++
          }
        } catch (error) {
          console.error(`❌ Error processing ${packageFile}:`, error.message)
        }
      }

      console.log('✅ Version synchronization completed successfully')
      console.log(
        `📦 Updated ${updatedCount} packages to version ${targetVersion}`,
      )
      console.log(`✅ ${correctCount} packages already had correct version`)
    } catch (error) {
      console.error('❌ Error during version sync:', error.message)
      process.exit(1)
    }
  }

  /**
   * Показать справку
   */
  showHelp() {
    console.log(`
🔧 Dependency Compatibility Manager - Bun + Lerna Integration

Usage: node scripts/dependency-compatibility-manager.js <command>

Commands:
  backup-and-resolve  Prepare packages for Lerna publish (replace catalog:* and workspace:*)
  restore            Restore original dependencies after Lerna publish
  sync-versions      Sync all package versions with lerna.json version

Examples:
  # Prepare for Lerna publish
  node scripts/dependency-compatibility-manager.js backup-and-resolve

  # Publish with Lerna
  lerna publish

  # Restore original dependencies
  node scripts/dependency-compatibility-manager.js restore

  # Sync versions with lerna.json
  node scripts/dependency-compatibility-manager.js sync-versions

Supported dependency formats:
  - catalog:*              → Resolves to specific version from root package.json
  - catalog:name           → Resolves to specific version from named catalog
  - workspace:*           → Resolves to current version or lerna.json version
  - workspace:^1.0.0      → Resolves to ^1.0.0 (preserves semver range)

Note: Always run restore after lerna publish to maintain catalog:* and workspace:* references.
`)
  }
}

// Main execution
async function main() {
  const command = process.argv[2]

  if (!command) {
    console.error('❌ No command specified')
    console.error(
      'Usage: node scripts/dependency-compatibility-manager.js <command>',
    )
    console.error('Run with --help for more information')
    process.exit(1)
  }

  const manager = new DependencyCompatibilityManager()

  switch (command) {
    case 'backup-and-resolve':
      await manager.backupAndResolve()
      break
    case 'restore':
      await manager.restore()
      break
    case 'sync-versions':
      await manager.syncVersions()
      break
    case 'help':
    case '--help':
    case '-h':
      manager.showHelp()
      break
    default:
      console.error(`❌ Unknown command: ${command}`)
      console.error('Run with --help for available commands')
      process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  })
}

module.exports = DependencyCompatibilityManager
