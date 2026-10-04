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
    // Chromium is the default: all three browsers (726 tests) take over an hour on a laptop agent.
    choice(name: 'BROWSER', choices: ['chromium', 'all', 'firefox', 'webkit'], description: 'Browser project to run')
  }

  triggers {
    // Daily at 07:00, 12:00 and 16:00 India time (TZ makes this independent of the server's time zone).
    // A Jenkins on a laptop only runs schedules while the machine is on.
    cron('''TZ=Asia/Kolkata
0 7,12,16 * * *''')
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
        runCmd("npx playwright test ${params.BROWSER == 'all' ? '' : '--project=' + params.BROWSER}")
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
    }
    failure {
      // Screenshots, traces and videos of failed tests.
      archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
    }
  }
}
