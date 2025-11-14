const { User } = require("../db/models");

class UserService {
  static async getAllUsers() {
    return User.findAll();
  }

  static async getUserById(id) {
    return User.findByPk(id);
  }

  static async createUser(data) {
    return User.create(data);
  }

  static async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.destroy();
  }
}

module.exports = UserService;
