const validateValue = (value) => {
  if (value > 50) {
    return true;
  }
  return false;
};

module.exports = validateValue;
