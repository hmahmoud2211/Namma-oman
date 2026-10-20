// Learn more https://docs.expo.dev/guides/customizing-metro
const http = require('http');
const https = require('https');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * The eWeLink CUBE smart-home hub sends no CORS headers, so in the browser the app calls it as
 * `/cube/...` on the dev server, and this forwards the request to the hub
 * (src/constants/cubeConfig.ts). Native builds call the hub directly. Development only: a
 * static web export has no dev server, so Smart Home shows its sample devices there.
 */
const CUBE_PREFIX = '/cube/';
const cubeUrl = new URL(process.env.EXPO_PUBLIC_CUBE_URL || 'http://192.168.1.119');

function proxyToCube(req, res) {
  const upstream = http.request(
    {
      hostname: cubeUrl.hostname,
      port: cubeUrl.port || 80,
      method: req.method,
      path: req.url.slice(CUBE_PREFIX.length - 1),
      headers: { ...req.headers, host: cubeUrl.host },
    },
    (hubResponse) => {
      res.writeHead(hubResponse.statusCode || 502, hubResponse.headers);
      hubResponse.pipe(res);
    },
  );
  upstream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ error: 502, data: {}, message: 'smart home hub unreachable' }));
  });
  req.pipe(upstream);
}

/**
 * The video call server sends no CORS headers either, so the browser calls its REST API as
 * `/meet/api/...` and this forwards it (src/constants/meetConfig.ts). In production Vercel
 * does the same (vercel.json). Its presence WebSocket connects directly; native builds call
 * the server directly.
 */
const MEET_PREFIX = '/meet/';
const meetUrl = new URL(process.env.EXPO_PUBLIC_MEET_URL || 'https://meet.ems-iot.com');

function proxyToMeet(req, res) {
  const client = meetUrl.protocol === 'https:' ? https : http;
  const upstream = client.request(
    {
      hostname: meetUrl.hostname,
      port: meetUrl.port || (meetUrl.protocol === 'https:' ? 443 : 80),
      method: req.method,
      path: req.url.slice(MEET_PREFIX.length - 1),
      headers: { ...req.headers, host: meetUrl.host, origin: meetUrl.origin },
    },
    (meetResponse) => {
      res.writeHead(meetResponse.statusCode || 502, meetResponse.headers);
      meetResponse.pipe(res);
    },
  );
  upstream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ error: 'Video call server unreachable' }));
  });
  req.pipe(upstream);
}

const enhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const next = enhanceMiddleware ? enhanceMiddleware(middleware, server) : middleware;
  return (req, res, fallthrough) => {
    if (req.url && req.url.startsWith(CUBE_PREFIX)) return proxyToCube(req, res);
    if (req.url && req.url.startsWith(MEET_PREFIX)) return proxyToMeet(req, res);
    return next(req, res, fallthrough);
  };
};

module.exports = config;
