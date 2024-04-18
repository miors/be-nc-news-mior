const app = require("./app");
const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) {
    console.log(
      `Error whilst listening on port:${PORT} with the following error:${err}`
    );
  }
  console.log(`Listeening on ${PORT}...`);
});
