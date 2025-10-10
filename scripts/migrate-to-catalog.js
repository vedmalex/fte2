#!/usr/bin/env node

/**
 * Catalog Migration Script
 *
 * Автоматически мигрирует зависимости из workspace packages
 * в централизованную Bun catalog структуру в root package.json.
 *
 * Возможности:
 * - Сканирует все packages в apps/* и packages/*
 * - Группирует зависимости по категориям (runtime, build, testing, development)
 * - Разрешает конфликты версий автоматически
 * - Создает catalog структуру в root package.json
 * - Заменяет зависимости на catalog:* references
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

class CatalogMigrator {
  constructor() {
    this.rootDir = process.cwd()
    this.rootPackageJson = path.join(this.rootDir, 'package.json')
    this.workspacePatterns = ['apps/*/package.json', 'packages/*/package.json']
    this.catalogs = {
      catalog: {},
      catalogs: {
        build: {},
        testing: {},
        development: {},
      },
    }
    this.stats = {
      packagesScanned: 0,
      dependenciesFound: 0,
      conflictsResolved: 0,
      catalogEntries: 0,
    }
  }

  /**
   * Показывает справку
   */
  showHelp() {
    console.log(`
🔧 Catalog Migration Script - Migrate to Bun Catalogs

Usage: node scripts/migrate-to-catalog.js <command>

Commands:
  analyze          Analyze dependencies without making changes
  migrate          Perform migration to catalog structure
  help            Show this help message

Examples:
  # Analyze current dependencies
  node scripts/migrate-to-catalog.js analyze

  # Migrate to catalog structure
  node scripts/migrate-to-catalog.js migrate

Migration Process:
  1. Scans all workspace packages for dependencies
  2. Groups dependencies by category (runtime, build, testing, development)
  3. Resolves version conflicts automatically
  4. Creates catalog structure in root package.json
  5. Replaces dependencies with catalog:* references

Supported Categories:
  - Runtime: Core dependencies (react, lodash, axios, etc.)
  - Build: Build tools (typescript, vite, esbuild, etc.)
  - Testing: Test frameworks (vitest, jest, etc.)
  - Development: Dev tools (eslint, prettier, etc.)
`)
  }

  /**
   * Определяет категорию зависимости
   */
  categorizeDependency(depName, depVersion) {
    // Runtime dependencies
    const runtimeDeps = [
      'react',
      'react-dom',
      'vue',
      'angular',
      'svelte',
      'lodash',
      'axios',
      'express',
      'mongoose',
      'redis',
      'zod',
      'yup',
      'joi',
      'chalk',
      'commander',
    ]

    // Build dependencies
    const buildDeps = [
      'typescript',
      'vite',
      'webpack',
      'rollup',
      'esbuild',
      'babel',
      '@babel',
      'swc',
      '@swc',
      'tsc',
      'tsx',
      'postcss',
      'tailwindcss',
      'sass',
      'less',
    ]

    // Testing dependencies
    const testingDeps = [
      'vitest',
      'jest',
      '@vitest',
      '@jest',
      'testing-library',
      'supertest',
      'cypress',
      'playwright',
      'mocha',
      'chai',
    ]

    // Development dependencies
    const devDeps = [
      'eslint',
      '@eslint',
      'prettier',
      '@typescript-eslint',
      'husky',
      'lint-staged',
      'commitlint',
      'nodemon',
    ]

    const name = depName.toLowerCase()

    if (runtimeDeps.some((dep) => name.includes(dep))) {
      return 'catalog'
    }

    if (buildDeps.some((dep) => name.includes(dep))) {
      return 'build'
    }

    if (testingDeps.some((dep) => name.includes(dep))) {
      return 'testing'
    }

    if (devDeps.some((dep) => name.includes(dep))) {
      return 'development'
    }

    // По умолчанию - runtime
    return 'catalog'
  }

  /**
   * Разрешает конфликты версий
   */
  resolveVersionConflict(depName, versions) {
    if (versions.length === 1) {
      return versions[0]
    }

    // Если все версии одинаковые, используем эту версию
    const uniqueVersions = [...new Set(versions)]
    if (uniqueVersions.length === 1) {
      return uniqueVersions[0]
    }

    // Для разных версий выбираем самую новую (простая эвристика)
    // В будущем можно улучшить логику разрешения конфликтов
    console.log(`⚠️  Version conflict for ${depName}:`, versions.join(', '))

    // Пока выбираем первую версию как fallback
    const result = versions[0]
    console.log(`✅ Resolved to: ${result}`)
    this.stats.conflictsResolved++

    return result
  }

  /**
   * Сканирует зависимости в package.json файле
   */
  scanPackageDependencies(packageFile) {
    try {
      const content = fs.readFileSync(packageFile, 'utf8')
      const packageData = JSON.parse(content)

      const dependencies = {
        ...(packageData.dependencies || {}),
        ...(packageData.devDependencies || {}),
        ...(packageData.peerDependencies || {}),
      }

      return dependencies
    } catch (error) {
      console.error(`❌ Error scanning ${packageFile}:`, error.message)
      return {}
    }
  }

  /**
   * Находит все workspace packages
   */
  findWorkspacePackages() {
    const packageFiles = []

    for (const pattern of this.workspacePatterns) {
      try {
        const files = execSync(
          `find . -name "package.json" -path "./${pattern}" -type f`,
          {
            encoding: 'utf8',
            cwd: this.rootDir,
          },
        )
          .trim()
          .split('\n')
          .filter(Boolean)

        packageFiles.push(...files)
      } catch (error) {
        // Игнорируем ошибки для несуществующих паттернов
      }
    }

    return packageFiles
  }

  /**
   * Анализирует зависимости без изменений
   */
  async analyze() {
    console.log('🔍 Analyzing dependencies for catalog migration...')

    try {
      const packageFiles = this.findWorkspacePackages()
      console.log(`📦 Found ${packageFiles.length} workspace packages`)

      const allDependencies = new Map()

      for (const packageFile of packageFiles) {
        this.stats.packagesScanned++

        const dependencies = this.scanPackageDependencies(packageFile)

        for (const [depName, depVersion] of Object.entries(dependencies)) {
          // Пропускаем workspace и локальные зависимости
          if (
            depVersion.startsWith('workspace:') ||
            depVersion.startsWith('file:')
          ) {
            continue
          }

          this.stats.dependenciesFound++

          if (!allDependencies.has(depName)) {
            allDependencies.set(depName, {
              versions: [],
              category: this.categorizeDependency(depName, depVersion),
            })
          }

          const depInfo = allDependencies.get(depName)
          if (!depInfo.versions.includes(depVersion)) {
            depInfo.versions.push(depVersion)
          }
        }
      }

      // Разрешаем конфликты версий и строим catalogs
      for (const [depName, depInfo] of allDependencies) {
        const resolvedVersion = this.resolveVersionConflict(
          depName,
          depInfo.versions,
        )
        const category = depInfo.category

        if (category === 'catalog') {
          this.catalogs.catalog[depName] = resolvedVersion
        } else {
          this.catalogs.catalogs[category][depName] = resolvedVersion
        }

        this.stats.catalogEntries++
      }

      // Показываем результаты
      console.log('\n📊 Analysis Results:')
      console.log(`📦 Packages scanned: ${this.stats.packagesScanned}`)
      console.log(`🔗 Dependencies found: ${this.stats.dependenciesFound}`)
      console.log(`⚔️  Conflicts resolved: ${this.stats.conflictsResolved}`)
      console.log(`📋 Catalog entries: ${this.stats.catalogEntries}`)

      console.log('\n📦 Generated Catalogs:')
      if (Object.keys(this.catalogs.catalog).length > 0) {
        console.log('\nRuntime Dependencies (catalog):')
        for (const [dep, version] of Object.entries(this.catalogs.catalog)) {
          console.log(`  ${dep}: ${version}`)
        }
      }

      for (const [category, deps] of Object.entries(this.catalogs.catalogs)) {
        if (Object.keys(deps).length > 0) {
          console.log(`\n${category} Dependencies:`)
          for (const [dep, version] of Object.entries(deps)) {
            console.log(`  ${dep}: ${version}`)
          }
        }
      }

      console.log('\n✅ Analysis completed successfully!')
      console.log('💡 Run "migrate" command to apply these changes')
    } catch (error) {
      console.error('❌ Error during analysis:', error.message)
      process.exit(1)
    }
  }

  /**
   * Выполняет миграцию в catalog структуру
   */
  async migrate() {
    console.log('🔄 Starting catalog migration...')

    try {
      // Сначала выполняем анализ
      await this.analyze()

      if (this.stats.catalogEntries === 0) {
        console.log('ℹ️  No dependencies to migrate')
        return
      }

      // Загружаем текущий root package.json
      const rootPackage = JSON.parse(
        fs.readFileSync(this.rootPackageJson, 'utf8'),
      )

      // Обновляем workspaces секцию
      if (!rootPackage.workspaces) {
        rootPackage.workspaces = { packages: ['packages/*'] }
      }

      rootPackage.workspaces.catalog = this.catalogs.catalog
      rootPackage.workspaces.catalogs = this.catalogs.catalogs

      // Сохраняем обновленный package.json
      fs.writeFileSync(
        this.rootPackageJson,
        JSON.stringify(rootPackage, null, 2) + '\n',
      )

      console.log('\n✅ Migration completed successfully!')
      console.log(
        `📦 Updated root package.json with ${this.stats.catalogEntries} catalog entries`,
      )
      console.log('🎯 Dependencies are now centralized in catalogs')

      // Теперь нужно заменить зависимости в пакетах на catalog:*
      await this.updateWorkspacePackages()
    } catch (error) {
      console.error('❌ Error during migration:', error.message)
      process.exit(1)
    }
  }

  /**
   * Обновляет workspace пакеты для использования catalog ссылок
   */
  async updateWorkspacePackages() {
    console.log('\n🔄 Updating workspace packages to use catalog references...')

    try {
      const packageFiles = this.findWorkspacePackages()
      let updatedPackages = 0

      for (const packageFile of packageFiles) {
        try {
          const content = fs.readFileSync(packageFile, 'utf8')
          const packageData = JSON.parse(content)
          let modified = false

          // Обрабатываем каждую секцию зависимостей
          for (const section of [
            'dependencies',
            'devDependencies',
            'peerDependencies',
          ]) {
            if (!packageData[section]) continue

            for (const [depName, depVersion] of Object.entries(
              packageData[section],
            )) {
              // Пропускаем workspace и локальные зависимости
              if (
                depVersion.startsWith('workspace:') ||
                depVersion.startsWith('file:')
              ) {
                continue
              }

              // Проверяем, есть ли зависимость в каталогах
              const category = this.categorizeDependency(depName, depVersion)

              if (category === 'catalog' && this.catalogs.catalog[depName]) {
                packageData[section][depName] = 'catalog:'
                modified = true
              } else if (
                category !== 'catalog' &&
                this.catalogs.catalogs[category]?.[depName]
              ) {
                packageData[section][depName] = `catalog:${category}`
                modified = true
              }
            }
          }

          // Сохраняем изменения
          if (modified) {
            fs.writeFileSync(
              packageFile,
              JSON.stringify(packageData, null, 2) + '\n',
            )
            console.log(`✅ Updated: ${packageFile}`)
            updatedPackages++
          }
        } catch (error) {
          console.error(`❌ Error updating ${packageFile}:`, error.message)
        }
      }

      console.log(`\n✅ Updated ${updatedPackages} workspace packages`)
      console.log('🎯 All dependencies now use catalog:* references')
    } catch (error) {
      console.error('❌ Error updating workspace packages:', error.message)
    }
  }
}

// Main execution
async function main() {
  const command = process.argv[2] || 'help'

  const migrator = new CatalogMigrator()

  switch (command) {
    case 'analyze':
      await migrator.analyze()
      break
    case 'migrate':
      await migrator.migrate()
      break
    case 'help':
    case '--help':
    case '-h':
      migrator.showHelp()
      break
    default:
      console.error(`❌ Unknown command: ${command}`)
      console.error('Available commands: analyze, migrate, help')
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

module.exports = CatalogMigrator
