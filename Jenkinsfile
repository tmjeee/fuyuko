pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        dir(path: 'be') {
          echo 'inside be/'
          sh 'pwd'
          sh 'git status'
          sh 'node -v'
        }
        dir(path: 'fe') {
          echo 'insdie fe/'
          sh 'pwd'
          sh 'git status'
          sh 'node -v'
        }
        echo 'inside root'
        sh 'pwd'
        sh 'git status'
        echo 'end'
      }
    }
  }
}
