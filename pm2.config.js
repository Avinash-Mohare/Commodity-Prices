module.exports = {
    apps: [
        {
            name: "comm_server",
            script: "index.js",
            watch: true,
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        },
        {
            name: "scheduler",
            script: "scheduler.js",
            watch: true,
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
};
