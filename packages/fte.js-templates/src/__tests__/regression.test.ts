import { exec } from 'child_process';
import { promisify } from 'util';
import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

describe('Template Generation Regression Test', () => {
  it('should successfully bundle the minimal reproduction template', async () => {
    const packageRoot = path.resolve(__dirname, '..', '..');
    const projectRoot = path.resolve(packageRoot, '..', '..');
    const fteCliPath = path.join(projectRoot, 'packages', 'fte.js', 'bin', 'fte.js');
    const templatesPath = path.join(projectRoot, 'demo');
    const outputPath = path.join(packageRoot, 'demo/dist');
    const outputFilePath = path.join(outputPath, 'minimal_repro.ts');

    // Ensure the output directory exists and is clean
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath, { recursive: true, force: true });
    }
    fs.mkdirSync(outputPath, { recursive: true });

    const nodeExec = process.execPath;
    const command = `${nodeExec} ${fteCliPath} bundle ${templatesPath} ${outputPath} --single --file minimal_repro --ext ts --typescript`;

    let commandOutput = '';
    let errorObject = null;
    try {
      const { stdout, stderr } = await execAsync(command, { cwd: projectRoot });
      commandOutput = `STDOUT: ${stdout}\nSTDERR: ${stderr}`;
    } catch (error) {
      errorObject = error;
      commandOutput = `STDOUT: ${error.stdout}\nSTDERR: ${error.stderr}`;
    }

    // For debugging, log the output.
    console.log(commandOutput);

    // The command should exit with code 0
    expect(errorObject).toBeNull();

    // Check if the output file was created
    expect(fs.existsSync(outputFilePath)).toBe(true);

    // Read the generated file and perform sanity assertions
    const generatedContent = fs.readFileSync(outputFilePath, 'utf-8');
    expect(generatedContent.length).toBeGreaterThan(100);
    expect(generatedContent).toContain("export const templates = {");
    expect(generatedContent).toContain("['simple/dist/filewriter.d.ts']");
    expect(generatedContent).toContain('const F = new Factory(templates);');
  }, 10000); // Increase timeout for the external process
});
