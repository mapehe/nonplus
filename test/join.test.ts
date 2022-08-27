import { describe, expect, test, beforeAll } from "@jest/globals";
import { select } from "../src/select";
import sqlite3 from "sqlite3";

describe("Joins", () => {
  const db = new sqlite3.Database(":memory:");

  const table1 = {
    name: "table_1",
    first: "id",
    second: "age",
    third: "height",
  };
  const table2 = {
    name: "table_2",
    first: "id",
    second: "name",
    third: "address",
  };
  const joinColumn = "id";
  const lowerLimit = 20;

  beforeAll(() => {
    db.exec(
      `CREATE TABLE ${table1.name} (${table1.first} NUMBER, ${table1.second} NUMBER, ${table1.third} NUMBER)`
    );
    db.exec(
      `CREATE TABLE ${table2.name} (${table2.first} NUMBER, ${table2.second} TEXT, ${table2.third} TEXT)`
    );
    db.exec(
      `INSERT INTO ${table1.name} (${table1.first}, ${table1.second}, ${table1.third}) VALUES (1, 20, 180)`
    );
    db.exec(
      `INSERT INTO ${table2.name} (${table2.first}, ${table2.second}, ${table2.third}) VALUES (1, 'Name', 'Address')`
    );
  });

  describe("INNER JOIN", () => {
    test("a basic inner join can be created", () => {
      // eslint-disable-next-line max-len
      const expected = `SELECT ${table1.name}.${table1.first}, ${table1.name}.${table1.second} FROM ${table1.name} INNER JOIN ${table2.name} ON ${table1.name}.${joinColumn} = ${table2.name}.${joinColumn}`;
      const query = select(
        `${table1.name}.${table1.first}`,
        `${table1.name}.${table1.second}`
      )
        .from(table1.name)
        .innerJoin(table2.name)
        .on(`${table1.name}.${joinColumn} = ${table2.name}.${joinColumn}`)
        .render();

      expect(query).toBe(expected);
      db.get(query);
    });

    test("an inner join combines correctly with a where-clause", () => {
      // eslint-disable-next-line max-len
      const expected = `SELECT ${table1.name}.${table1.first}, ${table1.name}.${table1.second} FROM ${table1.name} INNER JOIN ${table2.name} ON ${table1.name}.${joinColumn} = ${table2.name}.${joinColumn} WHERE ${table1.name}.${table1.second} > ${lowerLimit}`;
      const query = select(
        `${table1.name}.${table1.first}`,
        `${table1.name}.${table1.second}`
      )
        .from(table1.name)
        .innerJoin(table2.name)
        .on(`${table1.name}.${joinColumn} = ${table2.name}.${joinColumn}`)
        .where(`${table1.name}.${table1.second} > ${lowerLimit}`)
        .render();

      expect(query).toBe(expected);
      db.get(query);
    });
  });
});
