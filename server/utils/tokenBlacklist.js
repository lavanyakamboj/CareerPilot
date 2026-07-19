/**
 * JWT stateless hote hain, isliye normally "logout" sirf client-side
 * token delete karta hai — server ko pata hi nahi chalta. Yeh ek simple
 * in-memory blacklist hai jo logout par token ko explicitly invalid
 * kar deti hai (expiry tak) taaki agar token kahin leak ho jaaye
 * (browser history, logs, XSS) to logout ke baad wo kaam na kare.
 *
 * NOTE: Yeh single-server-instance ke liye theek hai. Agar production
 * mein multiple server instances (load balancer ke peeche) chalane ho,
 * to isse Redis jaisi shared store se replace karo, warna ek instance
 * par logout hone ke baad bhi token doosre instance par valid rahega.
 */

const blacklist = new Map(); // token -> expiryTimestamp (ms)

const blacklistToken = (token, expiresAtSeconds) => {
  const expiryMs = expiresAtSeconds ? expiresAtSeconds * 1000 : Date.now() + 24 * 60 * 60 * 1000;

  blacklist.set(token, expiryMs);
};

const isTokenBlacklisted = (token) => blacklist.has(token);

// Har 30 min mein expired entries clean kar dete hain taaki memory grow na ho.
setInterval(() => {
  const now = Date.now();

  for (const [token, expiry] of blacklist.entries()) {
    if (expiry < now) blacklist.delete(token);
  }
}, 30 * 60 * 1000).unref();

module.exports = { blacklistToken, isTokenBlacklisted };
