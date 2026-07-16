import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const WORK_DIR = join(tmpdir(), 'java-easy');
if (!existsSync(WORK_DIR)) mkdirSync(WORK_DIR, { recursive: true });
const MAIN_JAVA = join(WORK_DIR, 'Main.java');

const TIMEOUT_MS = 10000;
const JAVA_FLAGS = '-XX:MaxRAM=64m -Xmx64m -XX:TieredStopAtLevel=1 -noverify';

// Detect Java version for --source flag
let JAVA_VERSION = 22;
try {
  const verOut = execSync('java -version 2>&1').toString();
  const m = verOut.match(/(\d+)/);
  if (m) JAVA_VERSION = parseInt(m[1]);
} catch {}

app.post('/api/run', async (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    writeFileSync(MAIN_JAVA, code, 'utf-8');

    const startTime = Date.now();
    let runStdout = '', runStderr = '';
    try {
      const buf = execSync(
        `java ${JAVA_FLAGS} --source ${JAVA_VERSION} -cp "${WORK_DIR}" "${MAIN_JAVA}" 2>&1`,
        { cwd: WORK_DIR, timeout: TIMEOUT_MS, maxBuffer: 5 * 1024 * 1024 }
      );
      runStdout = buf.toString();
    } catch (runErr) {
      const out = runErr.stdout?.toString() || '';
      const err = runErr.stderr?.toString() || runErr.message || '';
      runStdout = out;
      runStderr = err || out;
    }
    const totalTime = Date.now() - startTime;

    if (runStderr && !runStdout) {
      return res.json({ success: false, compileError: cleanJavaErrors(runStderr, 'Main.java'), output: '', executionTime: totalTime });
    }

    res.json({ success: true, output: runStdout, error: runStderr, executionTime: totalTime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verify', async (req, res) => {
  const { code, expectedOutput } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    writeFileSync(MAIN_JAVA, code, 'utf-8');

    let runStdout = '';
    try {
      const buf = execSync(
        `java ${JAVA_FLAGS} --source ${JAVA_VERSION} -cp "${WORK_DIR}" "${MAIN_JAVA}" 2>&1`,
        { cwd: WORK_DIR, timeout: TIMEOUT_MS, maxBuffer: 5 * 1024 * 1024 }
      );
      runStdout = buf.toString();
    } catch (runErr) {
      const out = runErr.stdout?.toString() || '';
      const err = runErr.stderr?.toString() || runErr.message || '';
      return res.json({ pass: false, error: 'Error:\n' + cleanJavaErrors(err || out, 'Main.java'), output: out });
    }

    const normalizedOutput = runStdout.trim().replace(/\r\n/g, '\n');
    const normalizedExpected = (expectedOutput || '').trim().replace(/\r\n/g, '\n');

    res.json({ pass: normalizedOutput === normalizedExpected, output: runStdout, expected: expectedOutput || '', error: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function cleanJavaErrors(stderr, fileName) {
  return stderr
    .replace(new RegExp(fileName.replace(/\./g, '\\.'), 'g'), 'Main.java')
    .replace(/^Main\.java:\d+:\s*(error|warning):\s*/gm, '')
    .replace(/\^/g, '')
    .split('\n')
    .filter(line => line.trim())
    .slice(0, 20)
    .join('\n');
}

app.listen(PORT, () => {
  console.log(`Java Easy backend running on http://localhost:${PORT} (Java ${JAVA_VERSION})`);
});
