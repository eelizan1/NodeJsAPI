const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash"); // pick a random array element
const { v4: uuid } = require("uuid");
const { response } = require("express");

const app = express();
app.use(express.json()); // middleware that parses req into json

// defines a new rout GET
// req: request coming from client
// res: response from server endpoint
app.get("/outfit", (req, res) => {
  // possible options
  const tops = ["Black", "White", "Orange", "Navy"];
  const jeans = ["Grey", "Dark Grey", "Black", "Navy"];
  const shoes = ["White", "Grey", "Black"];

  // sends json of random objects back
  res.json({
    top: _.sample(tops),
    jeans: _.sample(jeans),
    shoes: _.sample(shoes),
  });
});

// allows to post a new comment to a server
app.post("/comment", async (req, res) => {
  // generate new ID for the comment
  const id = uuid();
  // get content from comment
  const content = req.body.content;

  if (!content) return response.sendStatus(400);

  // save to file
  // note: to use await we need to include async in the header method
  await fs.mkdir("data/comments", { recursive: true });
  await fs.writeFile(`data/comments/${id}.txt`, content);

  res.status(201).json({
    id: id,
  }); // send success code
});

// get comment by the ID
app.get("/comments/:id", async (req, res) => {
  const id = req.params.id;
  let content;

  try {
    content = await fs.readFile(`data/comments/${id}.txt`, "utf8");
  } catch (err) {
    return res.sendStatus(404);
  }

  res.json({
    content: content,
  });
});

app.listen(3000, () => {
  console.log("API Server is running...");
});
