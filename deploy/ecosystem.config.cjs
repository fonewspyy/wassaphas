// PM2 process for the portfolio, run by the `wassaphas` user (not root).
// Lives at /srv/wassaphas/ecosystem.config.cjs; `current` is swapped by remote-deploy.sh.
module.exports = {
  apps: [
    {
      name: "wassaphas",
      cwd: "/srv/wassaphas/current",
      script: "server.js",
      interpreter: "node",
      node_args: "--env-file=/srv/wassaphas/shared/.env",
      env: {
        NODE_ENV: "production",
        PORT: "3100",
        HOSTNAME: "127.0.0.1", // nginx is the only way in
      },
      max_memory_restart: "400M",
      time: true,
    },
  ],
};
