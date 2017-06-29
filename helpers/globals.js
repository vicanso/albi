/** @module helpers/globals */

const map = new Map();

/**
 * Judge the application is running
 * @returns {Boolean}
 */
exports.isRunning = () => map.get('status') === 'running';

/**
 * Pause the application
 */
exports.pause = () => map.set('status', 'pause');

/**
 * Start the application
 */
exports.start = () => map.set('status', 'running');

/**
 * Set the level of system
 */
exports.setLevel = level => map.set('level', level);

/**
 * Get the level of system
 */
exports.getLevel = () => map.get('level') || 100;

/**
 * Get connecting count
 */
exports.getConnectingCount = () => map.get('connectingCount') || 0;

/**
 * Set connecting count
 */
exports.setConnectingCount = (count) => {
  let concurrency = 'low';
  if (count > 1000) {
    concurrency = 'high';
  } else if (count > 500) {
    concurrency = 'mid';
  }
  map.set('concurrency', concurrency);
  map.set('connectingCount', count);
};

/**
 * Get the concurrency
 */
exports.getConcurrency = () => map.get('concurrency') || 'low';
