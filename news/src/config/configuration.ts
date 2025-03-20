export const config = () => ({
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
});
