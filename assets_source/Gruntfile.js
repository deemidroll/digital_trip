 // ██████╗ ██████╗ ██╗   ██╗███╗   ██╗████████╗███████╗██╗██╗     ███████╗        ██╗███████╗
// ██╔════╝ ██╔══██╗██║   ██║████╗  ██║╚══██╔══╝██╔════╝██║██║     ██╔════╝        ██║██╔════╝
// ██║  ███╗██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██║██║     █████╗          ██║███████╗
// ██║   ██║██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║██║     ██╔══╝     ██   ██║╚════██║
// ╚██████╔╝██║  ██║╚██████╔╝██║ ╚████║   ██║   ██║     ██║███████╗███████╗██╗╚█████╔╝███████║
 // ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝     ╚═╝╚══════╝╚══════╝╚═╝ ╚════╝ ╚══════╝

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
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
                files: ['js/*.js', 'js/*/*.js', '../assets/js/tests/tests.js'],
                tasks: ['process'],
            },
            html: {
                files: '../assets/index.html',
            },
            // config: {
            //     files: ['package.json', 'Gruntfile.js'],
            //     tasks: ['exit']
            // },
        },
        concat_sourcemap: {
            options: {
                // sourcesContent: true
            },
            target: {
                files: {
                    '../assets_source/js/DT.js': [
                        'js/vendor/fireworks-bundle.js',
                        'js/vendor/Detector.js',
                        'js/vendor/threex.windowresize.js',
                        'js/vendor/Stats.js',
                        'js/vendor/threex.rendererstats.js',
                        'js/vendor/webaudio.js',
                        // 'js/vendor/headtrackr.js',
                        'js/vendor/THREEx.FullScreen.js',
                        'js/vendor/CopyShader.js',
                        'js/vendor/DotScreenShader.js',
                        'js/vendor/RGBShiftShader.js',
                        'js/vendor/EffectComposer.js',
                        'js/vendor/RenderPass.js',
                        'js/vendor/MaskPass.js',
                        'js/vendor/ShaderPass.js',
                        // 'js/vendor/StaticShader.js',
                        'js/vendor/BadTVShader.js',
                        'js/init.js',
                        'js/main.js',
                    ]
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: '../assets_source/js/DT.js.map',
                    banner: '/* Created by deemidroll | deemidroll@gmail.com | 2014 */',
                },
                files: {
                    '../assets/js/DT.min.js': ['../assets_source/js/DT.js'],
                    '../assets/js/myYepnope.min.js': ['js/myYepnope.js'],
                    '../assets/js/mobile.min.js': ['js/mobile.js'],
                }
            }
        },
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('process', ['concat_sourcemap', 'uglify']);
    grunt.registerTask('default', ['sass', 'concat_sourcemap', 'uglify', 'watch']);
}