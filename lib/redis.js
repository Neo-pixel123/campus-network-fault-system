import Redis from "ioredis";

const globalForRedis = globalThis;
export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL);
globalForRedis.redis = redis;

export const KEYS = {
  dashboard: "cache:dashboard:stats",   // STRING (JSON) with TTL
  activity: "activity:log",             // LIST of JSON events
  faultTypes: "stats:fault_types",      // HASH fault_type -> count
  hotDevices: "leaderboard:hot_devices",// ZSET device_name -> score
  rateLimit: (ip) => `ratelimit:report:${ip}`,
};

const PRIORITY_WEIGHT = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 5 };

// Cache-aside helper: return cached JSON or compute + store with TTL
export async function cached(key, ttlSeconds, compute) {
  const hit = await redis.get(key);
  if (hit) return { data: JSON.parse(hit), source: "redis" };
  const data = await compute();
  await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  return { data, source: "mysql" };
}

export async function logActivity(type, message) {
  const event = JSON.stringify({ type, message, at: new Date().toISOString() });
  await redis.multi().lpush(KEYS.activity, event).ltrim(KEYS.activity, 0, 49).exec();
}

export async function recordNewFault({ fault_type, priority, device_name }) {
  await redis
    .multi()
    .hincrby(KEYS.faultTypes, fault_type, 1)
    .zincrby(KEYS.hotDevices, PRIORITY_WEIGHT[priority] ?? 1, device_name)
    .del(KEYS.dashboard)
    .exec();
}

// Fixed-window limiter: max 5 reports per minute per client
export async function allowReport(ip) {
  const key = KEYS.rateLimit(ip);
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  return count <= 5;
}
