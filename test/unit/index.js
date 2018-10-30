// require all test file
const testsContext = require.context('./script', true, /\.spec$/)

testsContext.keys().forEach(testsContext)