const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// mongo db connection parameters
const connectionParams = {
  useNewUrlParser: true,
};

// the function to add it in the sirted manner
function sorted(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].priority > arr[j].priority) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
}

// DATABSE CONNECTION STARTED
mongoose
  .connect(process.env.DB_CONNECT, connectionParams)
  .then(() => {
    console.log("connected to the database");
    app.listen(3000, () => {
      console.log("server is up and running");
    });
  })
  .catch((err) => {
    console.error(`error in connecting to the database. n${err}`);
  });

// DATABASE CONNECTION DONE

// importing models for our database
const TodoTask = require("./models/ToDoTask");

app.get("/", (req, res) => {
  TodoTask.find({})
    .then(function (tasks) {
      console.log(tasks);
      sorted(tasks);
      res.render("todo.ejs", { todoTasks: tasks });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
    priority: req.body.priority,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

//update the tasks
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}).then(function (tasks) {
      res.render("edit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    console.log(req.body.content);
    console.log(req.body.priority);
    TodoTask.findByIdAndUpdate(
      id,
      { content: req.body.content[1], priority: req.body.priority[1] },
      { new: true }
    )
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });

// deleting
app
  .route("/remove/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id)
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .post((req, res) => {
    const id = req.body.checkbox;
    TodoTask.findByIdAndRemove(id)
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  });
