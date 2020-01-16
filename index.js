// implement your API here
const express = require("express");
const db = require("./data/db");
const server = express();

server.listen(4000, () => {
  console.log("=== server is listening on port 4000 ===");
});

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Hello World!");
});

server.post("/api/users", (req, res) => {
  const user = req.body;

  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user" });
  } else {
    db.insert(user)
      .then(user => {
        res.status(201).json({ success: true, user });
      })
      .catch(err => {
        res
          .status(500)
          .json({
            success: false,
            errorMessage:
              "There was an error while saving the user to the database"
          });
      });
  }
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ success: true, users });
    })
    .catch(err => {
      res
        .status(500)
        .json({
          success: false,
          errorMessage: "The users information could not be retrieved."
        });
    });
});

server.get("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({
            errorMessage: "The users information could not be retrieved."
          });
      } else {
        res.status(200).json({ success: true, user });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          success: false,
          errorMessage: "The user information could not be retrieved."
        });
    });
});

server.delete("/api/users/:id", (req, res) => {
  db.remove(req.params.id)
    .then(user => {
      if (user) {
        res.status(204).json({ success: true, message: `User was removed` });
      } else {
        res
          .status(404)
          .json({
            errorMessage: "The user with the specified ID does not exist."
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          success: false,
          errorMessage: "The user could not be removed."
        });
    });
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userInfo = req.body;

  db.update(id, userInfo)
    .then(updated => {
      if (!updated) {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
      } else if (!userInfo.name || !userInfo.bio) {
        res
          .status(400)
          .json({
            success: false,
            errorMessage: "Please provide name and bio for the user."
          });
        } else {
        res.status(201).json(updated)
      }
    })
    .catch(() => {
      res.status(500).json({ success: false,
          errorMessage: "The user information could not be modified."
        });
    });
});
