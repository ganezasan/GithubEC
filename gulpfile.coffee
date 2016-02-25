bower       = require 'bower'
del         = require 'del'
gulp        = require 'gulp'
concat      = require 'gulp-concat'
ghPages     = require 'gulp-gh-pages'
uglify      = require 'gulp-uglify'
browserSync = require 'browser-sync'

sources =
  js: [
    'js/*'
  ]
  css: [
    'styles/*'
  ]
  static: [
    'index.html'
  ]

libs =
  js: [
    'jquery/dist/jquery.js'
    'bootstrap/dist/js/bootstrap.min.js'
    'd3/d3.min.js'
    'imageviewer/dist/viewer.min.js'
    'marked/lib/marked.js'
    'remodal/dist/remodal.js'
  ]
  css:    [
    'bootstrap/dist/css/bootstrap.css'
    'imageviewer/dist/viewer.min.css'
    'font-awesome/css/font-awesome.min.css'
    'remodal/dist/remodal.css'
    'remodal/dist/remodal-default-theme.css'
  ]
  static: [
    'bootstrap/fonts/*'
    'font-awesome/fonts/*'
  ]

gulp.task 'default', ['clean'], ->
  gulp.start 'compile:lib', 'compile:js', 'compile:css', 'compile:static', 'browser-sync', 'watch'

gulp.task 'clean', (cb) ->
  del 'dist/', cb

gulp.task 'watch', ->
  gulp.watch sources.bower, ['compile:lib']
  gulp.watch sources.js,    ['compile:js']
  gulp.watch sources.css,   ['compile:css']
  gulp.watch sources.static, ['compile:static']

gulp.task 'compile:lib', ->
  bower.commands.install().on 'end', ->
    gulp.src libs.js.map (e) -> "bower_components/#{e}"
      .pipe concat 'lib.js'
      .pipe gulp.dest 'dist'
    gulp.src libs.css.map (e) -> "bower_components/#{e}"
      .pipe concat 'lib.css'
      .pipe gulp.dest 'dist'
    gulp.src libs.static.map (e) -> "bower_components/#{e}"
      .pipe gulp.dest 'dist/fonts'

gulp.task 'compile:js', ->
  gulp.src sources.js
    .pipe uglify()
    .pipe concat 'app.js'
    .pipe gulp.dest 'dist'

gulp.task 'compile:css', ->
  gulp.src sources.css
    .pipe concat 'app.css'
    .pipe gulp.dest 'dist'

gulp.task 'compile:static', ->
  gulp.src sources.static
    .pipe gulp.dest 'dist'

gulp.task 'browser-sync', ->
  browserSync.init
    server:
      baseDir: "dist",
      index: "index.html"

gulp.task 'deploy', ->
  gulp.src 'dist/**/*'
    .pipe ghPages
