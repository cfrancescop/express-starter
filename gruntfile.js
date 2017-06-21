module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    
    ts: {
      app: {
        files: [{
          src: ["src/\*\*/\*.ts"],
          dest: "./lib"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          allowJs:true,
          rootDir:"./src",
          sourceMap: false
        }
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "ts"
  ]);

};