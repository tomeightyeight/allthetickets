'use strict'

const forever = require('forever-monitor');

const child = new (forever.Monitor)('script.js', {
  max: 10,
  silent: false,
  args: []
});

child.on('restart', () => {
  console.error('Forever restarting script for ' + child.times + ' time')
});

child.on('exit:code', () => {
  console.error('Forever detected script exited with code ' + child.child.signalCode)
  
  if ('SIGTERM' === child.child.signalCode) {
    child.stop()
    process.exit(1)
  }
})

child.start()