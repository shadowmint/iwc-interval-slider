'use strict';
var ext = require('./.gruntExt');
module.exports = function (grunt) {

    // Compile parts
    ext.configure({
        sass: {
            compile: {
                files: {
                    'src/iwc-clock/styles.css': 'src/styles.scss'
                }
            }
        },
        jade: {
            compile: {
                files: {
                    'src/iwc-clock//markup.html': 'src/markup.jade'
                }
            }
        },
        typescript: {
            compile: {
                src: ['src/script.ts'],
                dest: 'src/iwc-clock/',
                options: {
                    module: 'amd',
                    target: 'es3',
                    basePath: 'src/',
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        watch: {
            sass: {
                files: ['src/*.scss'],
                tasks: ['sass:compile'],
                options: {
                    spawn: true
                }
            },
            jade: {
                files: ['src/*.jade'],
                tasks: ['jade:compile'],
                options: {
                    spawn: true
                }
            },
            typescript: {
                files: ['src/*.ts'],
                tasks: ['typescript:compile'],
                options: {
                    spawn: true
                }
            }
        }
    });
    ext.registerTask('compile', ['sass:compile', 'jade:compile', 'typescript:compile']);

    // Compile component
    ext.configure({
        iwc: {
            component: {
                src: 'src/iwc-clock',
                dest: 'dist'
            }
        },
        watch: {
            component: {
                files: [
                    'src/**/*.js',
                    'src/**/*.css',
                    'src/**/*.html'
                ],
                tasks: ['iwc:component'],
                options: {
                    spawn: true,
                    livereload: true
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
