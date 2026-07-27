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
      },
    },
  ],
};
