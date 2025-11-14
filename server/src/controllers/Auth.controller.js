const cookieConfig = require('../config/cookieConfig');
const AuthService = require('../services/Auth.Service');
const generateTokens = require('../utils/generateTokens');
const formatResponse = require('../utils/formatResponse');
const bcrypt = require('bcrypt');
const { User } = require('../db/models');

class AuthController {
  static async signup(req, res) {
    if (!req.body) {
      return res.status(400).json(formatResponse(400, 'Missing required fields'));
    }
    const { name, email, password } = req.body;
    const { isValid, error } = User.validateSignUpData({ email, name, password });
    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Ошибка валидации', null, error));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const { user, created } = await AuthService.register({
        email,
        name,
        password: hashedPassword,
      });

      if (!created) {
        return res.status(400).json(formatResponse(400, 'User already exists'));
      }

      const plainUser = user.get();
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      return res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(formatResponse(201, 'Success', { accessToken, user: plainUser }));
    } catch (err) {
      console.log(err);
      return res.status(500).json(formatResponse(500, 'Internal Server Error'));
    }
  }

  static async login(req, res) {
    if (!req.body) {
      return res.status(400).json(formatResponse(400, 'Missing required fields'));
    }
    const { email, password } = req.body;
    const { isValid, error } = User.validateLoginData({ email, password });
    if (!isValid) {
      return res.status(400).json(formatResponse(400, 'Ошибка валидации', null, error));
    }

    try {
      const user = await AuthService.getUserByEmail({ email });
      if (!user) {
        return res.status(400).json(formatResponse(400, 'User not found'));
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json(formatResponse(400, 'Invalid email or password'));
      }

      const plainUser = user.get();
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });
      return res
        .cookie('refreshToken', refreshToken, cookieConfig.refresh)
        .json(formatResponse(200, 'Success', { accessToken, user: plainUser }));
    } catch (err) {
      console.log(err);
      return res.status(500).json(formatResponse(500, 'Internal Server Error'));
    }
  }

  static async logout(req, res) {
    res.clearCookie('refreshToken').json(formatResponse(200, 'Success'));
  }

  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;

      const { accessToken, refreshToken } = generateTokens({ user });

      res.status(200).cookie('refreshToken', refreshToken, cookieConfig.refresh).json(
        formatResponse(200, 'Success', {
          user,
          accessToken,
        }),
      );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = AuthController;
