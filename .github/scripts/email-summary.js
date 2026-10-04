// Builds the CI email from the merged Playwright JSON report.
// Usage: node email-summary.js <results.json> <email.html>
// Writes the HTML body to <email.html> and `subject` / `status` to $GITHUB_OUTPUT.
const fs = require('fs');

const [resultsPath, htmlPath] = process.argv.slice(2);
const env = process.env;
const runUrl = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`;
const triggers = { schedule: 'Scheduled (daily)', push: 'Push', pull_request: 'Pull request', workflow_dispatch: 'Manual' };
const trigger = triggers[env.GITHUB_EVENT_NAME] || env.GITHUB_EVENT_NAME || 'Local';
const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function collectTests(suite, path, out) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests) {
      out.push({ project: test.projectName, status: test.status, title: [...path, spec.title].join(' › '), file: spec.file });
    }
  }
  for (const child of suite.suites || []) collectTests(child, child.title ? [...path, child.title] : path, out);
}

let status;
let subject;
let body;

if (!resultsPath || !fs.existsSync(resultsPath)) {
  status = 'error';
  subject = `⚠️ Playwright CI: no test results – ${trigger} – ${date}`;
  body = `<p>The test jobs did not produce any results (for example, dependency or browser installation failed).</p>
<p><a href="${runUrl}">Open the workflow run</a> to see the logs.</p>`;
} else {
  const report = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const tests = [];
  for (const suite of report.suites) collectTests(suite, [], tests);

  const projects = {};
  for (const t of tests) {
    const p = (projects[t.project] ||= { expected: 0, unexpected: 0, flaky: 0, skipped: 0 });
    p[t.status] = (p[t.status] || 0) + 1;
  }

  const { expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0 } = report.stats;
  const failed = tests.filter((t) => t.status === 'unexpected');
  const flakyTests = tests.filter((t) => t.status === 'flaky');
  const minutes = (duration / 60000).toFixed(1);

  status = unexpected > 0 ? 'failure' : 'success';
  subject = unexpected > 0
    ? `❌ Playwright CI: ${unexpected} failed, ${expected} passed – ${trigger} – ${date}`
    : `✅ Playwright CI: all ${expected} passed${flaky ? ` (${flaky} flaky)` : ''} – ${trigger} – ${date}`;

  const cell = 'style="border:1px solid #ddd;padding:6px 10px;text-align:left"';
  const rows = Object.entries(projects)
    .map(([name, p]) => `<tr><td ${cell}>${escape(name)}</td><td ${cell}>${p.expected}</td><td ${cell}>${p.unexpected}</td><td ${cell}>${p.flaky}</td><td ${cell}>${p.skipped}</td></tr>`)
    .join('');
  const list = (items) => `<ul>${items.map((t) => `<li>[${escape(t.project)}] ${escape(t.title)} <small>(${escape(t.file)})</small></li>`).join('')}</ul>`;

  body = `<h2 style="margin:0 0 8px">${status === 'success' ? '✅ All tests passed' : '❌ Some tests failed'}</h2>
<p><b>Passed:</b> ${expected} &nbsp; <b>Failed:</b> ${unexpected} &nbsp; <b>Flaky:</b> ${flaky} &nbsp; <b>Skipped:</b> ${skipped} &nbsp; <b>Duration:</b> ${minutes} min</p>
<table style="border-collapse:collapse">
<tr><th ${cell}>Project</th><th ${cell}>Passed</th><th ${cell}>Failed</th><th ${cell}>Flaky</th><th ${cell}>Skipped</th></tr>
${rows}
</table>
${failed.length ? `<h3>Failed tests</h3>${list(failed)}` : ''}
${flakyTests.length ? `<h3>Flaky tests (passed on retry)</h3>${list(flakyTests)}` : ''}`;
}

const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#222">
${body}
<p style="margin-top:16px"><b>Trigger:</b> ${escape(trigger)} &nbsp; <b>Branch:</b> ${escape(env.GITHUB_REF_NAME || '')} &nbsp; <b>Commit:</b> ${escape((env.GITHUB_SHA || '').slice(0, 7))}</p>
<p><a href="${runUrl}">Open the workflow run on GitHub</a></p>
<p style="color:#666">The full HTML report is attached (playwright-report.zip): unzip it and open <code>index.html</code>.</p>
</div>`;

fs.writeFileSync(htmlPath, html);
if (env.GITHUB_OUTPUT) {
  fs.appendFileSync(env.GITHUB_OUTPUT, `subject=${subject}\nstatus=${status}\n`);
}
console.log(subject);
