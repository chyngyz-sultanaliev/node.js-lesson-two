import buildServer from "./app";

const startServer = () => {
  const server = buildServer();
  const PORT = process.env.PORT || 3000;
  try {
    server.listen({ port: PORT, host: "0.0.0.0" }, () => {
      console.log(`${new Date()}`);
      console.log(`Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Server crash:${error}`);
    process.exit(1);
  }
};

startServer();
