CREATE TABLE todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    string VARCHAR,
    integer INTEGER,
    float INTEGER,
    date DATE boolean,
    boolean BOOLEAN DEFAULT FALSE
);
INSERT INTO todo (string, integer, float, date)
VALUES ('coba data', '2', '22.33', '2022-09-19');
INSERT INTO todo (string, integer, float, date)
VALUES ('coba lagi', '3', '45.33', '2021-03-29');
INSERT INTO todo (string, integer, float, date, boolean)
VALUES ('coba terus', '4', '55.43', '2019-12-22', true);
SELECT *
FROM todo
WHERE date BETWEEN DATE('2020-02-01') AND DATE('2022-02-28');