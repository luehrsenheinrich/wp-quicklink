const webpackConfig = require('./webpack.config');

module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({

  	// Define variables
	pkg:	 grunt.file.readJSON("package.json"),
	pkgLck:	 grunt.file.readJSON("package-lock.json"),


	// JAVASCRIPT
	eslint: {
		target: ['build/js/**/*.js'],
	},

	// PHP
	webpack: {
    prod: webpackConfig,
  },

	// Execute command line options
	shell: {
	  lint_php: {
			command: 'composer run-script lint',
		},
	},

	// WATCHER / SERVER

	// Watch
	watch: {
		js: {
			files: ['build/**/*.js', '!build/**/*.min.js', '!build/**/*.bundle.js'],
			tasks: ['dev-deploy'],
			options: {
				livereload: true
			},
		},
		php: {
			files: ['build/**/*.php'], // which files to watch
			tasks: ['deploy_php'],
			options: {
				livereload: true
			},
		},
		livereload: {
			files: ['build/**/*.html', 'build/**/*.txt'], // Watch all files
			tasks: ['dev-deploy'],
			options: {
				livereload: true
			}
		},
	},

	// Deployment Strategies

	// Copy the files to the target destination
	copy: {
		options : {
		  process: function (content, srcpath) {
			if(typeof(content) === "object"){
			 	return content;
			};
			grunt.template.addDelimiters('custom-delimiters', '<##', '##>');
			return grunt.template.process(content, {delimiters: 'custom-delimiters'});
		  },
		},
		build_php:  {expand: true, cwd: 'build', src: ['**/*.php'], dest: 'trunk/', filter: 'isFile'},
		build: {expand: true, cwd: 'build', src: ['**/*.min.js', '**/*.bundle.js', '**/*.min.css', '**/*.txt','**/*.svg','**/*.po','**/*.pot', '**/*.tmpl.html'], dest: 'trunk/', filter: 'isFile'},
		build_stream: {expand: true, options: { encoding: null }, cwd: 'build', src: ['**/*.mo', 'img/**/*'], dest: 'trunk/', filter: 'isFile'},
	},

	// Clean out folders
	clean: {
		options: { force: true },
		build: {
			expand: true,
			force: true,
		  cwd: "trunk/",
			src: ['**/*'],
		},
		zip: {
			expand: true,
			force: true,
		  cwd: '<%= pkg.slug %>/',
			src: ['**/*'],
		},
		update: {
			expand: true,
			force: true,
			cwd: 'update/',
			src: ['**/*'],
		}
	},

	// Create a ZIP file of the current trunk
	compress: {
	  main: {
			options: {
			  archive: 'update/<%= pkg.slug %>.zip'
			},
			files: [
			  {src: ['**'], cwd: 'trunk', expand: true, dest: '<%= pkg.slug %>'}, // includes files in path
			]
		  }
		}
  });

  // These tasks are not needed at the moment, as we do not have any css or js files (yet).
  grunt.registerTask( 'handle_js', ['webpack'] );
  grunt.registerTask( 'handle_php', [] );

	// Linting
	grunt.registerTask( 'lint_php', ['shell:lint_php'] );
	grunt.registerTask( 'lint_js', ['eslint'] );
	grunt.registerTask( 'lint', ['lint_php', 'lint_js' ] );

  // Deployment strategies. The dev-deploy runs with the watcher and performs quicker. The deploy performs a clean of the trunk folder and a clean copy of the needed files.
  grunt.registerTask( 'deploy_php', ['handle_php', 'newer:copy:build_php'] );

	// A complete deploy done during initial setup
  grunt.registerTask( 'deploy', ['handle_php', 'handle_js', 'clean:build', 'copy:build', 'copy:build_php', 'copy:build_stream'] );

	// A partial deploy during the watch tasks
  grunt.registerTask( 'dev-deploy', ['handle_js', 'newer:copy:build', 'newer:copy:build_stream'] );

  // The release task adds a new tag in the release folder.
  grunt.registerTask( 'release', ['lint', 'deploy', 'clean:update', 'compress'] );


};
