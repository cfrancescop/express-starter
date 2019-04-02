import express from "express";

import bodyParser from "body-parser";
import morgan from "morgan";
const app = express();

const jsonParser = bodyParser.json();

app.use(morgan("tiny"));
app.get("/", (request, response) => {
  response.json({message: "Hello World"});
});

app.post("/echo", jsonParser, (request, response) => {
  const body = request.body;
  response.json({message: `ECHO: ${body.message}`});
});

export = app;
