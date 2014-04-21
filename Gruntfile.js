module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: 'game/css/*.css',
                options: {
                    livereload: true,
                },
            },
            js: {
                files: 'game/js/*.js',
                options: {
                    livereload: true,
                },
            },
            html: {
                files: 'game/*.html',
                options: {
                    livereload: true,
                },
            }
        }
    });
    // grunt.loadNpmTasks('grunt-contrib-sass');
    // grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('default', ['watch']);
}