/**
 * 邮件发送相关
 */
const nodemailer = require('nodemailer');
const {
  URL,
} = require('url');

const configs = require('../configs');
const errors = require('../helpers/errors');

const mailConfigs = new URL(configs.email);
const transporter = nodemailer.createTransport({
  host: `smtp.${mailConfigs.host}`,
  port: 465,
  secure: true,
  auth: {
    user: `${mailConfigs.username}@${mailConfigs.host}`,
    pass: mailConfigs.password,
  },
});


/**
 * 发送邮件至某邮箱
 *
 * @param {String} subject 发送标题
 * @param {String} content 发送内容
 * @param {String} receipiant 接收者
 */
exports.send = async function send(subject, content, receipiant) {
  const mailOptions = {
    from: `"${mailConfigs.username}" <${mailConfigs.username}@${mailConfigs.host}`,
    to: receipiant,
    subject,
    text: content,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.info(`send email to ${receipiant} success`);
  } catch (err) {
    console.error(`send email to ${receipiant} fail, ${err.message}`);
    const e = errors.get('common.emailFail');
    e.message = err.message;
    throw e;
  }
};
