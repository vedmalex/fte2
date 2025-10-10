#!/usr/bin/env bun
/**
 * Safe template bundler with structure validation
 *
 * This script:
 * 1. Generates templates to src.new directory
 * 2. Validates that generated files have correct structure (not serialized as strings)
 * 3. Only replaces src/ if validation passes
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const TEMPLATES_DIR = path.join(__dirname, '..')
const SRC_DIR = path.join(TEMPLATES_DIR, 'src')
const SRC_NEW_DIR = path.join(TEMPLATES_DIR, 'src.new')
const TEMPLATES_INPUT = path.join(TEMPLATES_DIR, 'templates')
const FTE_BIN = path.join(__dirname, '../../fte.js/bin/fte.js')

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates that a TypeScript file has correct template structure
 * and is not serialized as a string in "code" field
 */
function validateTemplateFile(filePath: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    // Check for corrupted structure - serialized template as string
    if (content.includes('export default {\n    "code":') ||
      content.includes('export default {\n  "code":')) {
      result.valid = false
      result.errors.push(
        `File has corrupted structure: template serialized as string in "code" field`
      )
      return result
    }

    // Check for proper export structure
    if (!content.includes('export default {')) {
      result.valid = false
      result.errors.push('Missing export default statement')
      return result
    }

    // Check for script function
    if (!content.includes('script: function')) {
      result.valid = false
      result.errors.push('Missing script function')
      return result
    }

    // Warn if file is suspiciously large (might be malformed)
    const lines = content.split('\n')
    if (lines.length > 1000) {
      result.warnings.push(
        `File is unusually large (${lines.length} lines) - may be malformed`
      )
    }

  } catch (error) {
    result.valid = false
    result.errors.push(`Failed to read file: ${error}`)
  }

  return result
}

/**
 * Validates all generated template files
 */
function validateGeneratedFiles(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  }

  if (!fs.existsSync(SRC_NEW_DIR)) {
    result.valid = false
    result.errors.push('src.new directory does not exist')
    return result
  }

  const files = fs.readdirSync(SRC_NEW_DIR)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.endsWith('.err.ts') && f !== 'index.ts')

  console.log(`📋 Validating ${files.length} generated files...`)

  for (const file of files) {
    const filePath = path.join(SRC_NEW_DIR, file)
    const fileResult = validateTemplateFile(filePath)

    if (!fileResult.valid) {
      result.valid = false
      result.errors.push(`${file}: ${fileResult.errors.join(', ')}`)
    }

    if (fileResult.warnings.length > 0) {
      result.warnings.push(`${file}: ${fileResult.warnings.join(', ')}`)
    }
  }

  return result
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Safe Template Bundle Script')
  console.log('================================\n')

  // Step 1: Clean src.new if exists
  if (fs.existsSync(SRC_NEW_DIR)) {
    console.log('🧹 Cleaning existing src.new directory...')
    fs.rmSync(SRC_NEW_DIR, { recursive: true, force: true })
  }

  // Step 2: Create src.new directory
  console.log('📁 Creating src.new directory...')
  fs.mkdirSync(SRC_NEW_DIR, { recursive: true })

  // Step 3: Run bundle command to src.new
  console.log('🚀 Running bundle command...')
  const bundleCommand = `bun ${FTE_BIN} bundle ${TEMPLATES_INPUT} ${SRC_NEW_DIR} --typescript`

  try {
    execSync(bundleCommand, {
      cwd: TEMPLATES_DIR,
      stdio: 'inherit',
    })
    console.log('✅ Bundle command completed\n')
  } catch (error) {
    console.error('❌ Bundle command failed!')
    console.error(error)
    process.exit(1)
  }

  // Step 4: Validate generated files
  console.log('🔍 Validating generated files...')
  const validation = validateGeneratedFiles()

  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    validation.warnings.forEach(w => console.log(`  - ${w}`))
  }

  if (!validation.valid) {
    console.log('\n❌ Validation FAILED!')
    console.log('Errors:')
    validation.errors.forEach(e => console.log(`  - ${e}`))
    console.log('\n❗Generated files are in src.new/ for inspection')
    console.log('❗Original src/ directory is unchanged')
    process.exit(1)
  }

  console.log('✅ Validation passed!\n')

  // Step 5: Copy __tests__ directory if it exists in src
  const srcTestsDir = path.join(SRC_DIR, '__tests__')
  const newTestsDir = path.join(SRC_NEW_DIR, '__tests__')

  if (fs.existsSync(srcTestsDir)) {
    console.log('📋 Copying tests from src/__tests__...')
    fs.cpSync(srcTestsDir, newTestsDir, { recursive: true })
  }

  // Step 6: Copy index.ts if it exists
  const srcIndex = path.join(SRC_DIR, 'index.ts')
  const newIndex = path.join(SRC_NEW_DIR, 'index.ts')

  if (fs.existsSync(srcIndex)) {
    console.log('📋 Copying index.ts...')
    fs.copyFileSync(srcIndex, newIndex)
  }

  // Step 7: Replace src with src.new
  console.log('🔄 Replacing src/ with validated src.new/...')

  // Backup current src to src.backup
  const srcBackupDir = path.join(TEMPLATES_DIR, 'src.backup')
  if (fs.existsSync(srcBackupDir)) {
    fs.rmSync(srcBackupDir, { recursive: true, force: true })
  }
  fs.renameSync(SRC_DIR, srcBackupDir)

  // Rename src.new to src
  fs.renameSync(SRC_NEW_DIR, SRC_DIR)

  console.log('✅ Successfully updated src/ directory')
  console.log('📦 Previous version backed up to src.backup/')
  console.log('\n✨ Done!')
}

// Run the script
main()

