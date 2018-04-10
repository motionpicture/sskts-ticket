"use strict";
/**
 * セッション
 */
Object.defineProperty(exports, "__esModule", { value: true });
const connectRedis = require("connect-redis");
const session = require("express-session");
const redis = require("redis");
const redisClient = redis.createClient(Number(process.env.REDIS_PORT), process.env.REDIS_HOST, {
    password: process.env.REDIS_KEY,
    tls: {
        servername: process.env.REDIS_HOST
    },
    return_buffers: true
});
const sessionStore = new (connectRedis(session))({ client: redisClient });
exports.default = session({
    secret: 'TicketSecret',
    resave: false,
    rolling: true,
    proxy: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: (process.env.NODE_ENV === 'development')
            ? 1800000 // 30 * 60 * 1000
            : 2592000000 // 30 * 24 * 60 * 60 * 1000
    }
});
