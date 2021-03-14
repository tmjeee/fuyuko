pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        git(url: 'https://github.com/tmjeee/fuyuko.git', branch: 'workflow')
        dir(path: 'be') {
          pwd(tmp: true)
        }

        pwd()
      }
    }

  }
}