var express = require("express");
var router = express.Router();
var path = require("path");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(path.join(__dirname, "..", "db", "todo.db"));

router.get("/", function (req, res) {
  db.all(`select * from todo`, (err, raws) => {
    if (err) return res.send(err);
    res.render("list", { data: raws });
  });
});

module.exports = router;
