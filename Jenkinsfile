def _pwd = ""
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        // git(url: 'https://github.com/tmjeee/fuyuko.git', branch: 'workflow')
        dir(path: 'be') {
          _pwd = pwd(tmp: true)
          echo "${_pwd}"
        }

        pwd()
      }
    }

  }
}
