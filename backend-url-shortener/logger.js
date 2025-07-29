
const fs = require('fs');

function logEvent(eventType, message, data = {}) {
  const log = {
    timestamp: new Date().toISOString(),
    eventType,
    message,
    data,
  };

  const logs = JSON.parse(fs.readFileSync('logs.json', 'utf8') || '[]');
  logs.push(log);
  fs.writeFileSync('logs.json', JSON.stringify(logs, null, 2));
}

module.exports = { logEvent };
