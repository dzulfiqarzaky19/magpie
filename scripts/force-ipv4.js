const dns = require('dns');
const originalLookup = dns.lookup;

console.log('Force-IPv4: Monkey-patching dns.lookup to enforce family: 4');

dns.lookup = function(hostname, options, callback) {
  // Normalize arguments
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  // Force IPv4
  options.family = 4;
  
  // Explicitly disable hints that might cause issues (optional)
  // options.hints = 0;

  return originalLookup.call(this, hostname, options, callback);
};
