pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        // git(url: 'https://github.com/tmjeee/fuyuko.git', branch: 'workflow')
        dir(path: 'be') {
          def _pwd = pwd(tmp: true)
          echo "${_pwd}"
        }

        pwd()
      }
    }

  }
}
