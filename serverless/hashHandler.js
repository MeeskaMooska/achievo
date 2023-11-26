const bcrypt = require('bcrypt');

const saltRounds = 10

//hashPassword hashObject

const hashObject = async (object) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(object, salt)
    return hash
  } catch (error) {
    console.error('Error hashing object:', error)
    throw new Error('Error hashing object')
  }
}

const compareHashed = async (unHashed, hashed) => {
  try {
    return await bcrypt.compare(unHashed, hashed)
  } catch (error) {
    throw new Error('Error comparing hashed object')
  }
}

module.exports = { hashObject, compareHashed };