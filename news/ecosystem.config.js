module.exports = {
    apps: [
      {
        name: 'my-nest-app',
        script: 'dist/main.js', // Đường dẫn đến file main.js của ứng dụng Nest.js sau khi đã build
        instances: 'max', // Số lượng instances (quy mô dự án)
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  