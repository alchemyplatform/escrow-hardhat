const express = require('express');
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Escrow DApp listening on port ${port}`);
})
