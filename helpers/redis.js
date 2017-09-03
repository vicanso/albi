const Redis = require('ioredis');
const _ = require('lodash');

const configs = require('../configs');

const client = new Redis(configs.redisUri, {
  keyPrefix: `${configs.app}:`,
});

const delayLog = _.throttle((message, type) => {
  const maskUri = configs.redisUri.replace(/:\S+@/, '//:***@');
  if (type === 'error') {
    console.alert(`${maskUri} error, ${message})`);
  } else {
    console.info(`${maskUri} ${message}`);
  }
}, 3000);

client.on('error', err => delayLog(err.message, 'error'));

// 延时输出日志，避免一直断开连接时大量无用日志
client.on('connect', () => delayLog('connected'));


class SessionStore {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }
  async get(key) {
    const data = await this.redisClient.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }
  async set(key, json, maxAge) {
    await this.redisClient.psetex(key, maxAge, JSON.stringify(json));
  }
  async destroy(key) {
    await this.redisClient.del(key);
  }
}


exports.client = client;
exports.sessionStore = new SessionStore(client);
