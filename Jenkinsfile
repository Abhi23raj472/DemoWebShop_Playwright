// Jenkins pipeline for the Demo Web Shop Playwright tests.
// Works on Windows and Linux agents (commands go through run()).

def run(String cmd) {
  if (isUnix()) {
    sh cmd
  } else {
    bat cmd
  }
}

pipeline {
  agent any

  parameters {
    choice(name: 'BROWSER', choices: ['all', 'chromium', 'firefox', 'webkit'], description: 'Browser project to run')
  }

  triggers {
    // Daily around 10:00 in the Jenkins server's time zone (H spreads the exact minute).
    // A Jenkins on a laptop only runs schedules while the machine is on.
    cron('H 10 * * *')
  }

  options {
    timeout(time: 60, unit: 'MINUTES')
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
        run 'node --version'
        run 'npm ci'
        // Chromium is always needed: the "setup" project registers the test account with it.
        run "npx playwright install chromium ${params.BROWSER == 'all' ? 'firefox webkit' : params.BROWSER}"
      }
    }

    stage('Type check') {
      steps {
        run 'npm run typecheck'
      }
    }

    stage('Test') {
      steps {
        run "npx playwright test ${params.BROWSER == 'all' ? '' : '--project=' + params.BROWSER}"
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
