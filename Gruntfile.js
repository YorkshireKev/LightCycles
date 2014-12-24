module.exports = function(grunt) {
  grunt.initConfig({

    copy: {
      files: {
        src: 'lightcycles.html',
        dest: 'dist/lightcycles.html'
      }
    },

    uglify: {
      options: {
        mangle: true,
        report: "gzip"
      },
      my_target: {
        files: {
          'dist/lightcycles.js': ['lightcycles.js']
        }
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify', 'copy']);
};
