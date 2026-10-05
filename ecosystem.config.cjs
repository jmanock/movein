module.exports = {
  apps: [
    {
      name: "movein",
      cwd: __dirname,
      script: "npm",
      args: "start -- -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3006,
        DATABASE_PATH: "/var/lib/movein/movein.sqlite",
        RECEIPT_EXTRACTOR: "disabled",
        AUTH_DEV_LOG_MAGIC_LINKS: "false",
        AUTH_DEV_HOUSEHOLD: "false",
        RECEIPT_EXTRACTION_DEBUG: "false",
        NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-QC9FYWHVZZ",
        NEXT_PUBLIC_GA_DEBUG: "false",
        NEXT_PUBLIC_GA_ENABLE_DEV: "false",
      },
    },
  ],
};
