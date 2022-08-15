require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();
const today = new Date();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("sent", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :sent")
);

app.get("/api/persons", (reqeust, response) => {
  Person.find({}).then((p) => {
    response.json(p);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  Person.findById(id).then((p) => {
    response.json(p);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<h1>there are ${people.length} entries</h1><div>As of ${
      today.getMonth() + 1
    }-${today.getDate()}-${today.getFullYear()} </div>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  people = people.filter((p) => {
    return p.id !== id;
  });

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  //Error handling
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "missing content",
    });
  }
  if (
    people.some((p) => {
      return p.name === person.name;
    })
  ) {
    return response.status(400).json({
      error: "name is already present",
    });
  }

  newPerson = {
    name: person.name,
    number: person.number,
  };

  people = people.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
