const tokenCounts = new Map<string, number[]>();

export function rateLimit(options: {
  interval: number;
  uniqueTokenPerInterval: number;
}) {
  return {
    check(limit: number, token: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const now = Date.now();
        const timestamps = tokenCounts.get(token) || [];

        // Remove expired timestamps
        const valid = timestamps.filter((t) => now - t < options.interval);

        if (valid.length >= limit) {
          const error = new Error("Rate limit exceeded") as Error & { status: number };
          error.status = 429;
          tokenCounts.set(token, valid);
          return reject(error);
        }

        valid.push(now);

        // Enforce max unique tokens to prevent memory exhaustion
        if (tokenCounts.size >= options.uniqueTokenPerInterval) {
          // Remove the oldest entry
          const firstKey = tokenCounts.keys().next().value;
          if (firstKey !== undefined) {
            tokenCounts.delete(firstKey);
          }
        }

        tokenCounts.set(token, valid);
        resolve();
      });
    },
  };
}
