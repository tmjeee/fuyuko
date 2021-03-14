pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        dir(path: 'be') {
          echo 'inside be/'
          sh 'pwd'
          sh 'git status'
        }
        echo 'inside root'
        sh 'pwd'
        sh 'git status'
      }
    }
    echo 'end'
  }
}
