def myvar = ""
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        // git(url: 'https://github.com/tmjeee/fuyuko.git', branch: 'workflow')
        dir(path: 'be') {
          myvar=pwd(tmp: true)
          echo "${_pwd}"
        }

        pwd()
      }
    }

  }
}
