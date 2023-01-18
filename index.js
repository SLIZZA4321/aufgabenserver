const express = require("express")
const cors = require("cors")
require("dotenv").config()

const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")

const app = express()
const db = require("./db")

app.use(express.json())
app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
    })
)
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/register", (req, res) => {
  const {id, username, password, email, phone} = req.body
  
  bcrypt.hash(password, 10, (err, hash) => {
  
      db.query(
          "INSERT INTO users (id, username, password, email, phone) VALUES (?, ?, ?, ?, ?)",
          [id, username, hash, email, phone],
          (err, result) => {
              if(result) {
                  res.send(result)
              }
              if(err) {
                  res.send(err)
              }
          }
      )
  })
})

app.post("/checkEmail", (req, res) => {
  const {email} = req.body

  db.query("SELECT email from users WHERE email = ?",
  email,
  (err, result) => {
    if(err) {
      res.send(err)
    }
    if(res.length > 0) {
      res.send("Diese Email Adresse existiert bereits")
    } else {
      res.send(result)
    }
  })
})

app.post("/checkUsername", (req, res) => {
  const {username} = req.body

  db.query("SELECT username from users WHERE username = ?",
  username,
  (err, result) => {
    if(err) {
      res.send(err)
    }
    if(res.length > 0) {
      res.send("Diese Email Adresse existiert bereits")
    } else {
      res.send(result)
    }
  })
})

app.post("/login", (req, res) => {
  const {username, password} = req.body

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err })
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (error) {
            console.log(error)
          }
          if (response) {
            res.json({ loggedIn: true, message: "Logged In", id: result[0].id})
          } else {
            res.json({loggedIn: false, message: "Wrong Username/Password combination"})
          }
        });
      } else {
        res.json({loggedIn: false, message: "User doesn't exist"})
      }
    }
  );
});

app.post("/user", (req, res) => {
  const { id } = req.body
  db.query("SELECT username, email, role, phone, position, name FROM users WHERE id = ?;",
  id, 
  (err, result) => {
    if(err) {
      res.send(err)
    }
    if(res) {
      res.send(result)
    }
  }  
  )
})


app.post("/tasks", (req, res) => {
  const {id, title, text,tags, completed, createdBy, time, date} = req.body

  db.query(
    "INSERT INTO tasks (id, title, text, tags, completed, createdBy, time, date ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, title, text, tags, completed, createdBy, time, date],
    (error, result) => {
      if(error) {
        res.send(error)
      }
      if(result) {
        res.send(result)
      }
  })
});

app.post("/deleteTask", (req, res) => {
  const id = req.body.id;
  
  db.query(
    "DELETE FROM tasks WHERE id = ?",
    id,
    (error, result) => {
      if(error) {
        res.send(error)
      }
      if(result) {
        res.send(result)
      }
  })
  db.query(
    "DELETE FROM comments where taskId = ?",
    id, 
    (err, resp) => {
      if(err) {
        res.send(err)
      }
  })
})

app.post("/deleteComment", (req, res) => {
  const {id} = req.body;
  
  db.query(
    "DELETE FROM comments WHERE id = ?",
    id,
    (error, result) => {
      if(error) {
        res.send(error)
      }
      if(result) {
        res.send(result)
      }
  })
}) 

app.post("/updateStatus", (req, res) => {
  const id = req.body.id;
  const completed = req.body.completed;
  
  db.query(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed, id],
    (error, result) => {
      if(error) {
        res.send(error)
      }
      if(result) {
        res.send(result)
      }
  })
})

app.get("/allUsers", (req,res) => {
  db.query("SELECT id, username, email, phone, name, position, role FROM users", 
  (error, result) => {
    if(error) {
      res.send(error)
    }
    if(result) {
      res.send(result)
    }
  })
})

app.post("/updateTask", (req, res) => {
  const title = req.body.title;
  const text = req.body.text;
  const tags = req.body.tags;
  const id = req.body.id;
  
  db.query(
    "UPDATE tasks SET title = ?, text = ?, tags = ? WHERE id = ?",
    [title, text, tags, id],
    (error, result) => {
        if(error) {
          res.send(error)
        }
        if(result) {
          res.send(result)
        }
    })
})

app.get("/tasks", (req,res) => {
  db.query("SELECT * FROM tasks", 
  (error, result) => {
    if(error) {
      res.send(error)
    }
    if(result) {
      res.send(result)
    }
  })
})

app.post("/comments", (req, res) => {
  const {id, taskId, text, createdBy, time, date} = req.body
      db.query(
          "INSERT INTO comments (taskId, text, createdBy, id, time, date) VALUES (?, ?, ?, ?, ?, ?)",
          [taskId, text, createdBy, id, time, date],
          (error, result) => {
            if(error) {
              res.send(error)
            }
            if(result) {
              res.send(result)
            }
          }
      )
})

app.post("/updateEmail", (req, res) => {
  const {email, id} = req.body
      db.query(
        "UPDATE users SET email = ? WHERE id = ?",
          [email, id],
          (error, result) => {
            if(error) {
              res.send(error)
            }
            if(result) {
              res.send(result)
            }
          }
      );
});

app.post("/updatePhone", (req, res) => {
  const {phone, id} = req.body
      db.query(
        "UPDATE users SET phone = ? WHERE id = ?",
          [phone, id],
          (error, result) => {
            if(error) {
              res.send(error)
            }
            if(result) {
              res.send(result)
            }
          }
      );
});

app.post("/updatePosition", (req, res) => {
  const {position, id} = req.body
      db.query(
        "UPDATE users SET position = ? WHERE id = ?",
          [position, id],
          (error, result) => {
            if(error) {
              res.send(error)
            }
            if(result) {
              res.send(result)
            }
          }
      );
});

app.post("/updateName", (req, res) => {
  const {name, id} = req.body
      db.query(
        "UPDATE users SET name = ? WHERE id = ?",
          [name, id],
          (error, result) => {
            if(error) {
              res.send(error)
            }
            if(result) {
              res.send(result)
            }
          }
      );
});

app.post("/deleteUser", (req, res) => {
  const {username} = req.body
      db.query(
        "DELETE FROM users WHERE username = ?",
          username,
          (error, result) => {
            if(error) {
              res.send(error)
            }
            if(result) {
              res.send(result)
            }
          }
      )
      db.query(
        "DELETE FROM tasks WHERE createdBy = ?",
        username,
        (err, resp) => {
          if(err) {
            res.send(err)
          }
        }
      )
      db.query(
        "DELETE FROM comments WHERE createdBy = ?",
        username,
        (err, resp) => {
          if(err) {
            res.send(err)
          }
        }
      )
      db.query(
        "DELETE FROM notifications WHERE taskCreatedBy = ?",
        username,
        (err, resp) => {
          if(err) {
            res.send(err)
          }
        }
      ) 
})

app.get("/comments", (req,res) => {
  db.query("SELECT * FROM comments",
  (error, result) => {
    if(error) {
      res.log(error)
    }
    if(result) {
      res.send(result)
    }
  })
})

app.post("/insertNotification", (req,res) => {
  const {id, taskCreatedBy, message, taskId, commentCreatedBy, isRead, time, date} = req.body
  db.query("INSERT INTO notifications (id, taskCreatedBy, message, taskId, commentCreatedBy, isRead, time, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  [id, taskCreatedBy, message, taskId, commentCreatedBy, isRead, time, date],
  (error, result) => {
    if(error) {
      res.send(error)
    }
    if(result) {
      res.send(result)
    }
  })
})

app.get("/notifications", (req, res) => {
  db.query("SELECT * FROM notifications", 
  (err, result) => {
    if(err) {
      res.send(err)
    }
    if(result) {
      res.send(result)
    }
  })
})

app.post("/updateNotification", (req, res) => {
  const {isRead, id} = req.body
  db.query("UPDATE notifications SET isRead = ? WHERE id = ?", 
  [isRead, id],
  (err, result) => {
    if(err) {
      res.send(err)
    }
    if(result) {
      res.send(result)
    }
  })
})

app.post("/deleteNotification", (req, res) => {
  const {id} = req.body
  db.query("DELETE FROM notifications WHERE id = ?", 
    id,
  (err, result) => {
    if(err) {
      res.send(err)
    }
    if(result) {
      res.send(result)
    }
  })
})

app.post("/creatorData", (req, res) => {
  const {username} = req.body
  
  db.query(
    "SELECT email, phone from users WHERE username = ?",
    username,
    (error, result) => {
      if(error) {
        res.send(error)
      }
      if(result) {
        res.send(result)
      }
  })
})

app.get('/deleteCookie', (request, response) => {
  response.clearCookie('access-token');
  response.send('Cookie cleared');
});


app.listen(process.env.PORT, () => {
    console.log("running server")
})