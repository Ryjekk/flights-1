module.exports = (data) =>
  data
    .toString()
    .split('\n')
    .filter((r) => r !== '')
    .map((r) => r.split(','));
