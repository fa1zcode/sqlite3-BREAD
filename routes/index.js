const { raw } = require("express");
var express = require("express");
var router = express.Router();
var path = require("path");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(path.join(__dirname, "..", "db", "todo.db"));

router.get("/", function (req, res) {
  const url = req.url == "/" ? "/?page=1" : req.url;
  const page = req.query.page || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  db.get(`select count (*) as total from todo`, (err, raw) => {
    const jumlahHalaman = Math.ceil(raw.total / limit);
    console.log(raw);
    db.all(
      `select * from todo limit ? offset ?`,
      [limit, offset],
      (err, raws) => {
        if (err) return res.send(err);
        res.render("list", { data: raws, page, jumlahHalaman, url });
      }
    );
  });
});

router.get("/add", function (req, res) {
  res.render("add");
});

router.post("/add", function (req, res) {
  // query binding = use (?) to prevent hack via sql injection
  db.run(
    `insert into todo (string, integer, float, date, boolean) values (?,?,?,?,?)`,
    [
      req.body.string,
      parseInt(req.body.integer),
      parseFloat(req.body.float),
      req.body.date,
      req.body.boolean,
    ],
    (err, raws) => {
      if (err) return res.send(err);
      console.log(req, res);
      res.redirect("/");
    }
  );
});

router.get("/delete/:id", function (req, res) {
  const id = Number(req.params.id);
  db.run("delete from todo where id = ? ", [id], (err, raws) => {
    if (err) return res.send(err);
    console.log(raws);
    res.redirect("/");
  });
});

router.get("/edit/:id", function (req, res) {
  const id = Number(req.params.id);
  db.get("select * from todo where id = ?", [id], (err, raws) => {
    console.log(err);
    if (err) return res.send(err);
    res.render("edit", { data: raws });
  });
});

router.post("/edit/:id", function (req, res) {
  const id = Number(req.params.id);
  db.run(
    "update todo set string = ?, integer = ?, float = ?, date = ?, boolean = ? where id = ?",
    [
      req.body.string,
      req.body.integer,
      req.body.float,
      req.body.date,
      JSON.parse(req.body.boolean),
      id,
    ],
    (err, row) => {
      if (err) return res.send(err);
      res.redirect("/");
    }
  );
});

module.exports = router;
