import { exec } from 'child_process';
import { ConvexClient } from 'convex/browser';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { api } from '../convex/_generated/api';

dotenv.config({ path: '.env.local' });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
const execAsync = promisify(exec);

const argv = yargs(hideBin(process.argv))
  .option('target', {
    alias: 't',
    type: 'string',
    description: 'Convex deployment URL',
  })
  .parse();

if (CONVEX_URL || argv.target) {
  main(argv.target || CONVEX_URL)
    .then(() => process.exit(1))
    .catch(console.error);
} else {
  console.error('Need a Convex deployment URL');
  process.exit(0);
}

async function main(deploymentUrl: string) {
  const client = new ConvexClient(deploymentUrl);

  try {
    const projects = await client.query(api.internal.collectAllProjects, {});
    const previewsDir = path.join(process.cwd(), 'previews');

    await fs.mkdir(previewsDir, { recursive: true });

    for (const project of projects) {
      const outputPath = path.join(previewsDir, `${project._id}.webp`);
      console.log(`Capturing ${project.url}...`);

      try {
        await captureWindow(project.url, outputPath);
        console.log(`Saved to ${outputPath}`);
      } catch (error) {
        console.error(`Failed to capture ${project.url}:`, error);
      }
    }
  } finally {
    await client.close();
  }
}

async function captureWindow(url: string, outputPath: string) {
  const commands = [
    'tell application "Safari" to close every window',
    'tell application "Safari" to make new document',
    `tell application "Safari" to set URL of document 1 to "${url}"`,
    'tell application "Safari" to set bounds of window 1 to {52, 0, 1280, 832}',
    'delay 10',
  ]
    .map((cmd) => `-e '${cmd}'`)
    .join(' ');

  await execAsync(`osascript ${commands}`);
  await execAsync(
    `screencapture -W -x -l $(osascript -e 'tell app "Safari" to id of window 1') "${outputPath}"`,
  );
  await execAsync(
    'osascript -e \'tell application "Safari" to close window 1\'',
  );
}
