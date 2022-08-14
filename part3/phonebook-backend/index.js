const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const today = new Date();

app.use(cors());
app.use(express.json());
app.use(express.static('build'))
morgan.token("sent", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :sent")
);

function genID() {
  const max = people.length > 0 ? Math.max(...people.map((p) => p.id)) : 0;
  return max + 1;
}

let people = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (reqeust, response) => {
  response.json(people);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = people.find((p) => {
    return p.id === id;
  });

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
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

  newPerson={
    id: genID(),
    name: person.name,
    number: person.number,
  };
  
  people=people.concat(newPerson)
  response.json(newPerson);
});

const PORT = process.env.PORT||3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
