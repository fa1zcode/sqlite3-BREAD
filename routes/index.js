const { raw } = require("express");
var express = require("express");
var router = express.Router();
var path = require("path");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(path.join(__dirname, "..", "db", "todo.db"));

router.get("/", function (req, res) {
  const url = req.url == "/" ? "/?page=1" : req.url;

  let params = [];

  if (req.query.string) {
    params.push(`string like '%${req.query.string}%'`);
  }
  if (req.query.integer) {
    params.push(`integer = ${req.query.integer}`);
  }
  if (req.query.float) {
    params.push(`float like '${req.query.float}' `);
  }
  if (req.query.date) {
    params.push(`date = ${req.query.date}`);
  }
  if (req.query.boolean) {
    params.push(`boolean = ${req.query.boolean}`);
  }

  const page = req.query.page || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  let sql = "select count(*) as total from todo";
  if (params.length > 0) {
    sql += ` where ${params.join(" and ")}`;
  }

  db.get(sql, (err, raw) => {
    const jumlahHalaman = Math.ceil(raw.total / limit);
    sql = `select * from todo`;
    if (params.length > 0) {
      sql += ` where ${params.join(" and ")}`;
    }
    sql += ` limit ? offset ?`;

    console.log(sql)

    db.all(sql, [limit, offset], (err, raws) => {
      console.log(raws)
      if (err) return res.send(err);
      res.render("list", {
        data: raws,
        page,
        jumlahHalaman,
        query: req.query,
        url,
      });
    });
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
      JSON.parse(req.body.boolean),
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
      parseInt(req.body.integer),
      parseFloat(req.body.float),
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
