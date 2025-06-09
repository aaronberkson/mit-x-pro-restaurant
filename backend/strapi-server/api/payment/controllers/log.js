const fs = require('fs');
const path = require('path');

module.exports = {
  log: async (ctx) => {
    const { message } = ctx.request.body;
    const logPath = path.resolve(__dirname, '../../../track-stripe-log.txt');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] Frontend: ${message}\n`);
    ctx.send({ success: true });
  },
};
