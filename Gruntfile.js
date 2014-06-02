'use strict';
var ext = require('./.gruntExt');
module.exports = function (grunt) {

    // Compile parts
    ext.configure({
      sass: {
        compile: {
          files: {
            'src/iwc-clock/styles.css': 'src/iwc-clock/styles.scss'
          }
        }
      },
      jade: {
        compile: {
          files: {
            'src/iwc-clock/markup.html': 'src/iwc-clock/markup.jade'
          }
        }
      },
      watch: {
          sass: {
              files: ['src/iwc-clock/*.scss'],
              tasks: ['sass:compile'],
              options: {
                  spawn: true
              }
          },
          jade: {
              files: ['src/iwc-clock/*.jade'],
              tasks: ['jade:compile'],
              options: {
                  spawn: true
              }
          }
      }
    });
    ext.registerTask('compile', ['sass:compile', 'jade:compile']);

    // Compile component
    ext.configure({
        iwc: {
            component: {
                src: 'src/*',
                dest: 'dist',
                options: {
                    postfix: '.js'
                }
            }
        },
        watch: {
            component: {
                files: ['src/*'],
                tasks: ['iwc:component'],
                options: {
                    spawn: false
                }
            }
        }
    });
    ext.registerTask('component', ['iwc:component']);

    // Other bits
    ext.configure({
        clean: {
            component: ['dist/*']
        },
        connect: {
            demo: {
                options: {
                    port: 3008,
                    base: '.'
                }
            }
        }
    });

    // Build the task libraries
    ext.registerTask('default', ['clean', 'compile', 'component']);
    ext.registerTask('dev', ['default', 'connect', 'watch']);

    // Load config
    ext.initConfig(grunt);
};
