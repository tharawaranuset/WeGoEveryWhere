export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3001', 10),
  },
});