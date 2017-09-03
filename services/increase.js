/**
 * 用于生成各类自增值
 */

const mongo = require('../helpers/mongo');


exports.genOrderId = async function getOrderId() {
  const Increase = mongo.get('Increase');
  const category = 'order';
  const doc = await Increase.findOneAndUpdate({
    category,
  }, {
    category,
    $inc: {
      value: 1,
    },
  }, {
    new: true,
    upsert: true,
  }).lean();
  return doc.value;
};
