const base = require('./karma.base.config.js')

module.exports = function (config) {
  var options = Object.assign(base, {
    // browsers: ['PhantomJS'],
    browsers: ['Chrome'],
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: '../../coverage', subdir: '.' },
        { type: 'text-summary', dir: '../../coverage', subdir: '.' },
      ],
    },
    singleRun: true,
    plugins: base.plugins.concat([
      'karma-coverage',
      'karma-chrome-launcher',
      // 'karma-phantomjs-launcher',
    ])
  })

  // add babel-plugin-istanbul for code instrumentation
  options.webpack.module.rules[0].options = {
    plugins: [['istanbul', {
      exclude: [
        'test/',
        'dev/',
        'src/ast/static-optimize.js',
      ],
    }]],
  }

  config.set(options)
}
