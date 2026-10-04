// Builds the Jenkins result email from reports/junit.xml:
//   reports/email-subject.txt  – subject line
//   reports/email.html         – HTML body (totals, failed tests, report links)
//   reports/allure-report.html – the single-file Allure report, attached only when it is small enough
//                                for Gmail (25 MB limit, minus base64 overhead)
// Used by the Jenkinsfile; run after `npx allure generate`. Needs no extra packages.
import fs from 'node:fs';
import path from 'node:path';

const JUNIT = 'reports/junit.xml';
const ALLURE = 'allure-report/index.html';
const ATTACHMENT = 'reports/allure-report.html';
const MAX_ATTACHMENT_MB = 18;

const suite = process.env.SUITE || 'all';
const browser = process.env.BROWSER || 'chromium';
const buildUrl = process.env.BUILD_URL || '';
const buildName = process.env.BUILD_DISPLAY_NAME || '';

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Strips the ANSI colour codes Playwright puts in error messages.
const plain = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');

fs.mkdirSync('reports', { recursive: true });
fs.rmSync(ATTACHMENT, { force: true });

// ---- Parse the JUnit report (skipping the "setup" project, which only creates the test account) ----
const tests = [];
const xml = fs.existsSync(JUNIT) ? fs.readFileSync(JUNIT, 'utf8') : '';
for (const [, suiteAttrs, body] of xml.matchAll(/<testsuite ([^>]*)>([\s\S]*?)<\/testsuite>/g)) {
  const project = /hostname="([^"]*)"/.exec(suiteAttrs)?.[1] ?? '';
  if (project === 'setup') continue;
  for (const [, attrs, inner] of body.matchAll(/<testcase ([^>]*?)\/?>(?:([\s\S]*?)<\/testcase>)?/g)) {
    const content = inner ?? '';
    const failure = /<(?:failure|error)[^>]*message="([^"]*)"/.exec(content);
    tests.push({
      project,
      name: decode(/name="([^"]*)"/.exec(attrs)?.[1] ?? ''),
      file: decode(/classname="([^"]*)"/.exec(attrs)?.[1] ?? ''),
      time: Number(/time="([^"]*)"/.exec(attrs)?.[1] ?? 0),
      status: /<(failure|error)/.test(content) ? 'failed' : /<skipped/.test(content) ? 'skipped' : 'passed',
      error: failure ? plain(decode(failure[1])) : '',
    });
  }
}

const count = (status) => tests.filter((t) => t.status === status).length;
const passed = count('passed');
const failed = count('failed');
const skipped = count('skipped');
const total = tests.length;
const minutes = (tests.reduce((sum, t) => sum + t.time, 0) / 60).toFixed(1);
const result = total === 0 ? 'NO RESULTS' : failed > 0 ? 'FAILED' : 'PASSED';
const colour = result === 'PASSED' ? '#1a7f37' : '#cf222e';
const suiteLabel = { smoke: 'Smoke (@smoke)', regression: 'Regression (all except @smoke)', all: 'All tests' }[suite] ?? suite;

// ---- Attach the Allure report if it fits in an email ----
let attachmentNote;
if (!fs.existsSync(ALLURE)) {
  attachmentNote = 'No Allure report was generated for this build.';
} else {
  const mb = fs.statSync(ALLURE).size / 1024 / 1024;
  if (mb <= MAX_ATTACHMENT_MB) {
    fs.copyFileSync(ALLURE, ATTACHMENT);
    attachmentNote = `The Allure report (steps and screenshots) is attached: open <b>${path.basename(ATTACHMENT)}</b> in a browser.`;
  } else {
    attachmentNote = `The Allure report (${mb.toFixed(0)} MB) is too large to attach; open it from Jenkins with the link below.`;
  }
}

// ---- Subject and body ----
const subject = `[Jenkins] Demo Web Shop ${suiteLabel}${buildName ? ` ${buildName}` : ''}: ${result} (${passed}/${total} passed)`;

const row = (label, value) =>
  `<tr><td style="padding:4px 12px 4px 0;color:#57606a">${label}</td><td style="padding:4px 0"><b>${value}</b></td></tr>`;

const failedRows = tests
  .filter((t) => t.status === 'failed')
  .map(
    (t) => `<tr>
      <td style="padding:6px;border:1px solid #d0d7de">${escape(t.project)}</td>
      <td style="padding:6px;border:1px solid #d0d7de">${escape(t.name)}<br><span style="color:#57606a;font-size:12px">${escape(t.file)}</span></td>
      <td style="padding:6px;border:1px solid #d0d7de;font-family:Consolas,monospace;font-size:12px">${escape(t.error.split('\n')[0].slice(0, 300))}</td>
    </tr>`,
  )
  .join('');

const link = (label, url) => `<li><a href="${escape(url)}">${label}</a></li>`;
const links = buildUrl
  ? `<p style="margin:16px 0 4px">Reports in Jenkins (open on the PC running Jenkins):</p>
    <ul style="margin:0">
      ${link('Allure Report', `${buildUrl}Allure_20Report/`)}
      ${link('Playwright Report', `${buildUrl}Playwright_20Report/`)}
      ${link('Test results', `${buildUrl}testReport/`)}
      ${link('Console log', `${buildUrl}console`)}
    </ul>`
  : '';

const body = `<!doctype html>
<html><body style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#1f2328">
  <h2 style="margin:0 0 4px">Demo Web Shop – Playwright tests</h2>
  <div style="display:inline-block;padding:4px 10px;border-radius:4px;background:${colour};color:#fff;font-weight:bold">${result}</div>
  <table style="margin-top:12px;border-collapse:collapse">
    ${row('Suite', escape(suiteLabel))}
    ${row('Browser', escape(browser))}
    ${row('Build', escape(buildName || '-'))}
    ${row('Total', total)}
    ${row('Passed', `<span style="color:#1a7f37">${passed}</span>`)}
    ${row('Failed', `<span style="color:#cf222e">${failed}</span>`)}
    ${row('Skipped', skipped)}
    ${row('Test time', `${minutes} min`)}
  </table>
  ${
    failed
      ? `<h3 style="margin:20px 0 6px">Failed tests</h3>
  <table style="border-collapse:collapse;font-size:13px">
    <tr style="background:#f6f8fa"><th style="padding:6px;border:1px solid #d0d7de;text-align:left">Browser</th><th style="padding:6px;border:1px solid #d0d7de;text-align:left">Test</th><th style="padding:6px;border:1px solid #d0d7de;text-align:left">Error</th></tr>
    ${failedRows}
  </table>`
      : ''
  }
  <p style="margin-top:16px">${attachmentNote}</p>
  ${links}
</body></html>
`;

fs.writeFileSync('reports/email-subject.txt', subject);
fs.writeFileSync('reports/email.html', body);
console.log(`${subject}\n${attachmentNote.replace(/<[^>]+>/g, '')}`);
