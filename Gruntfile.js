var paths = {
  js: {
    vendors: [
      'ext/src/override/js/vendor/jquery-1.11.2.min.js',
      'ext/src/override/js/vendor/angular.min.js',
      'ext/src/override/js/vendor/angular-sanitize.min.js',
      'ext/src/override/js/vendor/lodash.min.js',
      'ext/src/override/js/vendor/marked.min.js',
    ], 
    app: ['ext/src/override/js/app.js'], 
    modules: [
      'ext/src/override/js/modules/storage.js', 
      'ext/src/override/js/modules/todo.js'
    ]
  },
  html: ['ext/src/override/*.html'],
  css: ['ext/src/override/style/*.scss', 'ext/src/override/style/**/*.scss'],
  themes: ['ext/src/override/themes/sass/*.scss']
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: [paths.js.app, paths.js.modules],
        tasks: ['concat'],
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
      },
      themes: {
        files: paths.themes,
        tasks: ['sass:themes'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: [paths.js.app, paths.js.modules]
    },
    concat: {
      options: {
        separator: ';',
      },
      vendors: {
        src: paths.js.vendors,
        dest: 'ext/src/override/js/vendor/vendors.js',
      },
      modules: {
        src: paths.js.modules,
        dest: 'ext/src/override/js/modules/modules.js',
      },
      app: {
        src: paths.js.app,
        dest: 'ext/src/override/js/app.min.js',
      }
    },
    uglify: {
      dist: {
        files: {
          'ext/src/override/js/modules/modules.js': 'ext/src/override/js/modules/modules.js',
          'ext/src/override/js/app.min.js': 'ext/src/override/js/app.min.js'
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
      themes: {
        options: { 
          style: 'expanded',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'ext/src/override/themes/sass/',
          src: ['*.scss'],
          dest: 'ext/src/override/themes/css/',
          ext: '.css'
        }]
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
  grunt.registerTask('default', ['sass:dev', 'sass:themes', 'concat', 'watch']);


  //prepare for deployment
  grunt.registerTask('build', ['sass:dist', 'sass:themes', 'concat', 'uglify']);


};