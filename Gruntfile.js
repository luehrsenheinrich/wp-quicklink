const webpackConfig = require('./webpack.config');
const gruntNewerLess = require('grunt-newer-less');

module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({

  	// Define variables
	pkg:	 grunt.file.readJSON("package.json"),
	pkgLck:	 grunt.file.readJSON("package-lock.json"),

	// LESS / CSS

	// Compile Less
	// Compile the less files
	less: {
	  development: {
			options: {
			  optimization: 2
			},
			files: {
			  "build/admin/admin.css": "build/admin/less/admin.less", // destination file and source file
			}
	  },
	},

	postcss: {
		autoprefix: {
			options: {
			  map: false, // inline sourcemaps
			  processors: [
				require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
			  ]
			},
			files: {
				"build/admin/admin.css": "build/admin/admin.css",

			}
		},
		minify: {
			options: {
				map: false,
				processors: [
					require('cssnano')({}),
				]
			},
			files: {
				"build/admin/admin.min.css": "build/admin/admin.css",

			}
		}
	},

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
		less: {
			files: ['build/**/*.less'], // which files to watch
			tasks: ['deploy_css'],
			options: {
				//livereload: true
			},
		},
		css: {
			files: ['build/**/*.css', 'build/*.css', ],
			tasks: [],
			options: {
				livereload: true
			}
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
		build_css:  {expand: true, cwd: 'build', src: ['**/*.min.css'], dest: 'trunk/', filter: 'isFile'},
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
		},

		newer: {
			options: {
				override: gruntNewerLess.overrideLess
			}
		}
  });

  // These tasks are not needed at the moment, as we do not have any css or js files (yet).
  grunt.registerTask( 'handle_css', ['less:development', 'newer:postcss:autoprefix', 'postcss:minify'] );
  grunt.registerTask( 'handle_js', ['webpack'] );
  grunt.registerTask( 'handle_php', ['shell:lint_php'] );

  // Deployment strategies. The dev-deploy runs with the watcher and performs quicker. The deploy performs a clean of the trunk folder and a clean copy of the needed files.
  grunt.registerTask( 'deploy_css', ['handle_css', 'newer:copy:build_css'] );
  grunt.registerTask( 'deploy_php', ['handle_php', 'newer:copy:build_php'] );

  grunt.registerTask( 'deploy', ['handle_php', 'eslint', 'handle_js', 'handle_css', 'clean:build', 'copy:build', 'copy:build_css', 'copy:build_php', 'copy:build_stream'] );

  grunt.registerTask( 'dev-deploy', ['handle_js', 'handle_css', 'newer:copy:build', 'newer:copy:build_stream'] );

  // The release task adds a new tag in the release folder.
  grunt.registerTask( 'release', ['deploy', 'clean:update', 'compress'] );


};
