const bcrypt = require("bcryptjs");

const saltRounds = 10;

module.exports = {
  hashPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  comparePassword: async (enteredPassword, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
