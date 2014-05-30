'use strict';
module.exports = function (grunt) {

    // Tasks
    require('matchdep').filterAll(['*-grunt', 'grunt-*']).forEach(function (x) { grunt.loadNpmTasks(x); });

    // Project configuration.
    grunt.initConfig({

        // Before generating any new files, remove any previously-created files.
        clean: {
            component: ['dist/*']
        },

        // Assemble
        iwc: {
            component: {
                src: 'src/*',
                dest: 'dist',
                options: {
                    postfix: '.js'
                }
            }
        },

        // Watch
        watch: {
            component: {
                files: ['src/*'],
                tasks: ['iwc:component'],
                options: {
                    spawn: false
                }
            }
        },

        // Demo
        connect: {
            lib: {
                options: {
                    port: 3008,
                    base: '.'
                }
            }
        }
    });

    // Build the task libraries
    grunt.registerTask('default', ['clean', 'iwc']);
    grunt.registerTask('dev', ['default', 'connect', 'watch']);
};
