// Jenkins pipeline for the Demo Web Shop Playwright tests.
// Works on Windows and Linux agents (commands go through runCmd()).

def runCmd(String cmd) {
  if (isUnix()) {
    sh cmd
  } else {
    bat cmd
  }
}

pipeline {
  agent any

  parameters {
    // smoke: tests tagged @smoke; regression: every other test; all: both (the full suite).
    choice(name: 'SUITE', choices: ['all', 'smoke', 'regression'], description: 'Tests to run: all, smoke (@smoke only) or regression (everything except @smoke)')
    // Chromium is the default: all three browsers (726 tests) take over an hour on a laptop agent.
    choice(name: 'BROWSER', choices: ['chromium', 'all', 'firefox', 'webkit'], description: 'Browser project to run')
    choice(name: 'SCREENSHOTS', choices: ['step', 'failure'], description: 'step: screenshot after every step; failure: only when a test fails (faster)')
  }

  triggers {
    // India time (TZ makes this independent of the server's time zone), via the Parameterized Scheduler
    // plugin: 07:00 runs the smoke tests, 13:00 runs the rest, so the full suite runs every day.
    // A Jenkins on a laptop only runs schedules while the machine is on.
    parameterizedCron('''TZ=Asia/Kolkata
0 7 * * * %SUITE=smoke
0 13 * * * %SUITE=regression''')
  }

  options {
    timeout(time: 150, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
  }

  environment {
    // CI mode in playwright.config.ts: retries, 1 worker, test.only forbidden.
    CI = 'true'
    // Keep downloaded browsers between builds instead of re-downloading them every time.
    PLAYWRIGHT_BROWSERS_PATH = "${env.JENKINS_HOME}/tools/ms-playwright"
    // Screenshot mode (typescript/utils/steps.ts); scheduled builds use the default, "step".
    SCREENSHOTS = "${params.SCREENSHOTS ?: 'step'}"
    SUITE = "${params.SUITE ?: 'all'}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        runCmd('node --version')
        runCmd('npm ci')
        // Chromium is always needed: the "setup" project registers the test account with it.
        runCmd("npx playwright install chromium ${params.BROWSER == 'all' ? 'firefox webkit' : params.BROWSER}")
      }
    }

    stage('Type check') {
      steps {
        runCmd('npm run typecheck')
      }
    }

    stage('Test') {
      steps {
        script {
          def project = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
          def filter = [smoke: '--grep @smoke', regression: '--grep-invert @smoke'][env.SUITE] ?: ''
          runCmd("npx playwright test ${project} ${filter}")
        }
      }
    }
  }

  post {
    always {
      junit testResults: 'reports/junit.xml', allowEmptyResults: true
      publishHTML(target: [
        reportName: 'Playwright Report',
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true,
      ])
      // Allure report as one self-contained file (Jenkins' report sandbox blocks the data requests of a
      // multi-file report). Trend history is kept in allure-history.jsonl in the workspace.
      script {
        try {
          withEnv(['ALLURE_SINGLE_FILE=true']) {
            runCmd('npx allure generate allure-results')
          }
        } catch (err) {
          echo "Allure report not generated: ${err}"
        }
      }
      publishHTML(target: [
        reportName: 'Allure Report',
        reportDir: 'allure-report',
        reportFiles: 'index.html',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true,
      ])
      // Result email (Email Extension plugin). The address comes from the REPORT_EMAIL environment
      // variable set in Manage Jenkins > System, so it is not stored in this public repository.
      // Sending goes through the SMTP account set up there; a mail problem never fails the build.
      script {
        try {
          if (env.REPORT_EMAIL?.trim()) {
            runCmd('node scripts/build-email.mjs')
            emailext(
              to: env.REPORT_EMAIL,
              subject: readFile('reports/email-subject.txt').trim(),
              body: readFile('reports/email.html'),
              mimeType: 'text/html',
              attachmentsPattern: 'reports/allure-report.html',
            )
          } else {
            echo 'REPORT_EMAIL is not set in Jenkins, so no result email was sent.'
          }
        } catch (err) {
          echo "Result email not sent: ${err}"
        }
      }
    }
    failure {
      // Screenshots, traces and videos of failed tests.
      archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
    }
  }
}
