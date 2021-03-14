pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        // git(url: 'https://github.com/tmjeee/fuyuko.git', branch: 'workflow')
        dir(path: 'be') {
          def myvar=pwd(tmp: true)
          sh "pwd"
        }

        pwd()
      }
    }

  }
}
