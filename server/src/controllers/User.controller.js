const userService = require("../services/User.Service")
const formatResponse = require('../utils/formatResponse');

class UserController {
static async getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(formatResponse('Список пользователей', users));
  } catch (error) {
    res.status(500).json(formatResponse('Ошибка сервера', null, error));
  }
}


static async getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json(formatResponse('Пользователь не найден'));
    }
    res.status(200).json(formatResponse('Пользователь найден', user));
  } catch (error) {
    res.status(500).json(formatResponse('Ошибка сервера', null, error));
  }
}


static async createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(formatResponse('Пользователь создан', user));
  } catch (error) {
    res.status(500).json(formatResponse('Ошибка при создании пользователя', null, error));
  }
}


static async updateUser(req, res) {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json(formatResponse('Пользователь не найден'));
    }
    res.status(200).json(formatResponse('Пользователь обновлён', updated));
  } catch (error) {
    res.status(500).json(formatResponse('Ошибка при обновлении пользователя', null, error));
  }
}


static async deleteUser(req, res) {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json(formatResponse('Пользователь не найден'));
    }
    res.status(200).json(formatResponse('Пользователь удалён'));
  } catch (error) {
    res.status(500).json(formatResponse('Ошибка при удалении пользователя', null, error));
  }
}
}

module.exports = UserController;
