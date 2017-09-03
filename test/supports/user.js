const request = require('superagent');

const {
  getUrl,
} = require('./utils');

request.Request.prototype.noCache = function noCache() {
  const method = this.method;
  // if get and head set Cache-Control:no-cache header
  // the If-None-Match field will not be added
  if (method === 'GET' || method === 'HEAD') {
    this.query({
      'cache-control': 'no-cache',
    });
  } else {
    this.set('Cache-Control', 'no-cache');
  }
  return this;
};

class User {
  constructor(options) {
    if (!options) {
      throw new Error('options can not be null');
    }
    this.options = options;
    this.agent = request.agent();
  }
  async login() {
    const {
      account,
    } = this.options;
    const agent = this.agent;
    const url = getUrl('/users/login');
    await agent.get(url)
      .set('Cache-Control', 'no-cache');
    const res = await agent.post(url)
      .send({
        account,
        password: 'tree.xie',
      });
    return res.body;
  }
  async me() {
    const res = await this.agent.get(getUrl('/users/me'))
      .set('Cache-Control', 'no-cache');
    return res.body;
  }
  async register() {
    const {
      password,
      account,
      email,
    } = this.options;
    const res = await this.agent.post(getUrl('/users/register'))
      .send({
        account,
        password,
        email,
      });
    return res.body;
  }
  async refresh() {
    await this.agent.patch(getUrl('/users/me'));
  }
  async logout() {
    const res = await this.agent.delete(getUrl('/users/logout'));
    return res.body;
  }
  get(url) {
    const agent = this.agent;
    return agent.get(getUrl(url));
  }
  patch(url) {
    const agent = this.agent;
    return agent.patch(getUrl(url));
  }
  post(url) {
    const agent = this.agent;
    return agent.post(getUrl(url));
  }
  delete(url) {
    const agent = this.agent;
    return agent.delete(getUrl(url));
  }
}

module.exports = User;
