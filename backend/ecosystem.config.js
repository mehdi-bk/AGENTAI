/**
 * PM2 Ecosystem Configuration
 * 
 * Process manager configuration for production deployment
 * MBK: PM2 configuration for production
 */

module.exports = {
  apps: [{
    name: 'leadflow-backend',
    script: './server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster', // Cluster mode for load balancing
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    // Auto-restart on crash
    autorestart: true,
    // Watch for file changes (development only)
    watch: false,
    // Max memory before restart (1GB)
    max_memory_restart: '1G',
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    // Restart delay
    min_uptime: '10s',
    max_restarts: 10
  }]
};
