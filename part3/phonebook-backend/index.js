require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();
const today = new Date();

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("sent", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :sent")
);

app.use(errorHandler);

app.get("/api/persons", (reqeust, response, next) => {
  Person.find({})
    .then((p) => {
      response.json(p);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((p) => {
      response.json(p);
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/info", (request, response) => {
  Person.find({}).then((result) => {
    response.send(
      `<h1>there are ${result.length} entries</h1><div>As of ${
        today.getMonth() + 1
      }-${today.getDate()}-${today.getFullYear()} </div>`
    );
  });
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  const p = new Person({
    name: person.name,
    number: person.number,
  });
  //Error handling
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "missing content",
    });
  }

  //You should return the file which was added (I don't know why)
  p.save().then((savedP) => {
    response.json(savedP);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updated) => {
      response.json(updated);
    })
    .catch((err) => next(err));
  //MySolution?
  // new Person({
  //   name: request.body.name,
  //   number: request.body.number,
  //   _id: request.body.id,
  // })
  //   .save()
  //   .then((savedP) => {
  //     response.json(savedP);
  //   });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
