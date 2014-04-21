module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {                                 // task
            dist: {                             // target
                files: {                        // dictionary of files
                    '../assets/css/game.css': 'scss/game.scss',
                    '../assets/css/mobile.css': 'scss/mobile.scss'
                }
            },
            options: {
                sourcemap: 'true'
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: 'scss/*.scss',
                tasks: ['newer:sass'],
            },
            js: {
                files: 'js/*.js',
                tasks: ['process'],
            },
            html: {
                files: '../game/*.html',
            }
        },
        concat: {
            dist: {
                src: [
                    'js/vendor/fireworks-bundle.js',
                    'js/vendor/Detector.js',
                    'js/vendor/threex.windowresize.js',
                    'js/vendor/Stats.js',
                    'js/vendor/webaudio.js',
                    'js/vendor/headtrackr.js',
                    'js/vendor/THREEx.FullScreen.js',
                    'js/vendor/ParallaxBarrierEffect.js',
                    'js/vendor/AnaglyphEffect.js',
                    'js/init.js',
                    'js/main.js',
                ],
                dest: '../assets/js/game.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    banner: '/* Created by deemidroll | deemidroll@gmail.com | 2014 */' 
                },
                files: {
                    '../assets/js/game.min.js': ['../assets/js/game.js'],
                    '../assets/js/myYepnope.min.js': ['js/myYepnope.js'],
                    '../assets/js/mobile.min.js': ['js/mobile.js']
                }
            }
        },
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('process', ['concat', 'uglify']);
    grunt.registerTask('default', ['sass', 'concat', 'uglify', 'watch']);
}