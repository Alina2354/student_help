const jwtConfig = require("./jwtConfig");

// Конвертируем строки времени в миллисекунды для cookie
const parseTimeToMs = (timeString) => {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  const match = timeString.match(/^(\d+)([smhd])$/);
  if (!match) return 1000 * 60 * 60 * 24; // default 1 day
  return parseInt(match[1]) * units[match[2]];
};

const cookieConfig = {
  access: {
    maxAge: parseTimeToMs(jwtConfig.access.expiresIn),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  refresh: {
    maxAge: parseTimeToMs(jwtConfig.refresh.expiresIn),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

module.exports = cookieConfig;
