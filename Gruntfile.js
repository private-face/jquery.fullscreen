module.exports = function(grunt) {

	const FILE_OPTIONS = { encoding: 'utf8' };
	const SOURCES = [
		'src/utils.js',
		'src/abstract-fullscreen.js',
		'src/native-fullscreen.js',
		'src/fallback-fullscreen.js',
		'src/jquery-fullscreen.js'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: grunt.file.read('src/build/banner.js', FILE_OPTIONS),
				footer: grunt.file.read('src/build/footer.js', FILE_OPTIONS)
			},
			source: {
				options: {
					compress: false,
					mangle: false,
					beautify: true
				},
				files: {
					'release/<%= pkg.name.toLowerCase() %>.js': SOURCES
				}
			},
			minified: {
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true
				},
				files: {
					'release/<%= pkg.name.toLowerCase() %>.min.js': SOURCES
				}
			}
		},
		watch: {
			scripts: {
				files: ['src/**/*.js', 'Gruntfile.js'],
				tasks: ['uglify:minified'],
				options: {
					spawn: false,
				},
			},
		}    
	});

	function updateJSONfile(fileName, field, value) {
		var fileContents = grunt.file.read(fileName, FILE_OPTIONS);
		var json = JSON.parse(fileContents);
		json[field] = value;
		fileContents = JSON.stringify(json, null, '\t');
		grunt.file.write(fileName, fileContents, FILE_OPTIONS);
	}

	grunt.registerTask('version', 'Update version in all project json files', function(version) {
		if (version) {
			updateJSONfile('package.json', 'version', version);
		} else {
			version = grunt.config.getRaw().pkg.version;
		}
		updateJSONfile('bower.json', 'version', version);
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['uglify:minified', 'watch']);
	grunt.registerTask('release', ['version', 'uglify:source', 'uglify:minified']);
};