/*

    Grunt installation:
    -------------------
    npm install -g grunt-cli
    npm install -g grunt-init
    npm init (creates a `package.json` file)

    Simple Dependency Install:
    --------------------------
    npm install (from the same root directory as the `package.json` file

    Tasks:
    --------------------------
    grunt (default is to watch both sass and coffeescript files)
    grunt sass (compile once)
    grunt watch (you can also explicitly call the watch task)

    All commands are detailed by running the following:
    --------------------------
    grunt --help

*/

module.exports = function(grunt) {

  // CONFIG ===================================/

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // configure sass --> grunt sass
    sass: {                                       // Task
      dev: {                                      // Target
        options: {                                // Target options
          style: 'expanded'
        },
        files: {                                  // Dictionary of files
          'css/styles.css': 'scss/styles.scss',   // 'destination': 'source'
          'css/ie.css': 'scss/ie.scss',
          'css/themes/*.css':'scss/themes/*.scss'
        }
      },
      prod: {                                     // Target
        options: {                                // Target options
          style: 'compressed'
        },
        files: {                                  // Dictionary of files
          'css/styles.css': 'scss/styles.scss',   // 'destination': 'source'
          'css/ie.css': 'scss/ie.scss',
          'css/themes/*.css':'scss/themes/*.scss'
        }
      }
    },

    // configure sass documentation --> grunt sassdoc
    sassdoc: {
      default: {
        src: 'scss',
        dest: 'docs',
        options: {
          package: 'package.json'
        }
      }
    },

    // configure concatenation --> grunt concat
    concat: {
      dist: {
        src: [
          'js/libs/*.js' // All JS in the libs folder
        ],
        dest: 'js/plugins.js'
      }
    },

    // configure minification --> grunt uglify
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          'js/build/plugins.js' : 'js/plugins.js',
          'js/build/global.js' : 'js/global.js'
        }
      }
    },

    // configure file watching --> grunt watch
    watch: {
      scripts: {
        files: ['js/**/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
            spawn: false,
        },
      },
      css: {
        files: ['scss/**/*.scss'],
        tasks: ['sass:dev'],
        options: {
            spawn: false,
        }
      },
      docs: {
        files: ['scss/**/*.scss'],
        tasks: ['sassdoc'],
        options: {
            spawn: false,
        }
      }

    },

    // configure image optimization --> grunt imagemin
    imagemin: {
      dynamic: {
        files: [{
            expand: true,
            cwd: 'img/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'img/build/'
        }]
      }
    }
  });

  // DEPENDENT PLUGINS =========================/

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-sassdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // TASKS =====================================/

  grunt.registerTask( 'default', [ 'watch'] ); // default 'grunt'
  grunt.registerTask( 'build', [ 'imagemin','sass:prod' ] ); // optimize images, compress css

};

/*
    Notes:

    When registering a new Task we can also pass in any other registered Tasks.
    e.g. grunt.registerTask('release', 'default requirejs'); // when running this task we also run the 'default' Task

    We don't do this above as we would end up running `sass:dev` when we only want to run `sass:dist`
    We could do it and `sass:dist` would run afterwards, but that means we're compiling sass twice which (although in our example quick) is extra compiling time.

    To run specific sub tasks then use a colon, like so...
    grunt sass:dev
    grunt sass:dist

*/
