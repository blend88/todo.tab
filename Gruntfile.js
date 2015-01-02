var paths = {
  js: ['*.js', 'ext/src/override/js/*.js', 'ext/src/override/js/**/*.js'],
  html: ['ext/src/override/*.html'],
  css: ['ext/src/override/style/*.scss', 'ext/src/override/style/**/*.scss']
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: paths.js,
        //tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: paths.html,
        options: {
          livereload: true
        }
      },
       css: {
        files: paths.css,
        tasks: ['sass:dev'],
        options: {
          livereload: true
        }
      }
    },
    sass: {
      dev: {
        options: { 
          style: 'expanded'
        },
        files: {
          'ext/src/override/style/style.css': 'ext/src/override/style/style.scss'
        }
      },
      dist: {
        options: {                       
          style: 'compressed'
        },
        files: {
          'ext/src/override/style/style.css': 'ext/src/override/style/style.scss'
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['sass:dev', 'watch']);


  //prepare for deployment
  grunt.registerTask('build', ['sass:dist']);


};