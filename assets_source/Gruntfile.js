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
                files: ['js/*.js', 'js/vendor/*.js'],
                tasks: ['process'],
            },
            gruntfile: {
                files: ['Gruntfile.js'],
            },
            html: {
                files: '../game/*.html',
            }
        },
        concat_sourcemap: {
            options: {
                // sourcesContent: true
            },
            target: {
                files: {
                    '../assets_source/js/all.js': [
                        'js/vendor/fireworks-bundle.js',
                        'js/vendor/Detector.js',
                        'js/vendor/threex.windowresize.js',
                        'js/vendor/Stats.js',
                        'js/vendor/webaudio.js',
                        // 'js/vendor/heaallrackr.js',
                        'js/vendor/THREEx.FullScreen.js',
                        // 'js/vendor/ParallaxBarrierEffect.js',
                        'js/vendor/AnaglyphEffect.js',
                        'js/init.js',
                        'js/DT/DT.service.js',
                        'js/DT/DT.audio.js',
                        'js/DT/DT.Game.js',
                        'js/DT/DT.Player.js',
                        'js/DT/DT.GameObject.js',
                        'js/DT/DT.GameCollectionObject.js',
                        'js/DT/DT.Shield.js',
                        'js/DT/DT.Dust.js',
                        'js/DT/DT.Stone.js',
                        'js/DT/DT.Coin.js',
                        'js/DT/DT.Bonus.js',
                        'js/DT/DT.Collection.js',
                        'js/DT/DT.StonesCollection.js',
                        'js/DT/DT.CoinsCollection.js',
                        'js/DT/DT.BonusesCollection.js',
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
                    sourceMapIn: '../assets_source/js/all.js.map',
                    banner: '/* Created by deemidroll | deemidroll@gmail.com | 2014 */',
                },
                files: {
                    '../assets/js/all.min.js': ['../assets_source/js/all.js'],
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