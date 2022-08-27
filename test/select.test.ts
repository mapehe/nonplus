import { describe, expect, test, beforeAll } from "@jest/globals";
import { all, select } from "../src/select";
import sqlite3 from "sqlite3";

describe("Table", () => {
  const db = new sqlite3.Database(":memory:");

  const table = "people";
  const first = "age";
  const second = "height";
  const third = "sex";
  const lowerLimit = 10;
  const upperLimit = 60;
  const upperLimit2 = 180;
  const like = "M";

  beforeAll(() => {
    db.exec(
      `CREATE TABLE ${table} (${first} NUMBER, ${second} NUMBER, ${third} TEXT)`
    );
    db.exec(
      `INSERT INTO ${table} (${first}, ${second}, ${third}) VALUES (25, 180, 'M')`
    );
  });

  describe("basic", () => {
    test("a simple query can be created", () => {
      const expected = `SELECT ${first}, ${second}, ${third} FROM ${table}`;
      const query = select(first, second, third).from(table).render();

      expect(query).toBe(expected);
      db.get(query);
    });

    test("a 'select *' can be created", () => {
      const expected = `SELECT * FROM ${table}`;
      const query = all.from(table).render();

      expect(query).toBe(expected);
      db.get(query);
    });
  });

  describe("where-clauses", () => {
    test("a where-clause can be created", () => {
      const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit}`;
      const query = select(first, second, third)
        .from(table)
        .where(`${first} > ${lowerLimit}`)
        .render();

      expect(query).toBe(expected);
      db.get(query);
    });

    describe("and", () => {
      test("where-clauses can be combined with and", () => {
        // eslint-disable-next-line max-len
        const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} AND ${first} < ${upperLimit}`;
        const query = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .and(`${first} < ${upperLimit}`)
          .render();

        expect(query).toBe(expected);
        db.get(query);
      });

      test("where-clauses can be combined with multiple ands", () => {
        // eslint-disable-next-line max-len
        const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} AND ${first} < ${upperLimit} AND ${second} < ${upperLimit2}`;
        const query = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .and(`${first} < ${upperLimit}`)
          .and(`${second} < ${upperLimit2}`)
          .render();

        expect(query).toBe(expected);
        db.get(query);

        // eslint-disable-next-line max-len
        const expected2 = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} AND ${first} < ${upperLimit} AND ${second} < ${upperLimit2} AND ${third} LIKE '${like}'`;
        const query2 = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .and(`${first} < ${upperLimit}`)
          .and(`${second} < ${upperLimit2}`)
          .and(`${third} LIKE '${like}'`)
          .render();

        expect(query2).toBe(expected2);
        db.get(query2);
      });
    });

    describe("or", () => {
      test("where-clauses can be combined with or", () => {
        // eslint-disable-next-line max-len
        const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} OR ${first} < ${upperLimit}`;
        const query = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .or(`${first} < ${upperLimit}`)
          .render();

        expect(query).toBe(expected);
        db.get(query);
      });

      test("where-clauses can be combined with multiple ors", () => {
        // eslint-disable-next-line max-len
        const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} OR ${first} < ${upperLimit} OR ${second} < ${upperLimit2}`;
        const query = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .or(`${first} < ${upperLimit}`)
          .or(`${second} < ${upperLimit2}`)
          .render();

        expect(query).toBe(expected);
        db.get(query);

        // eslint-disable-next-line max-len
        const expected2 = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} OR ${first} < ${upperLimit} OR ${second} < ${upperLimit2} OR ${third} LIKE '${like}'`;
        const query2 = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .or(`${first} < ${upperLimit}`)
          .or(`${second} < ${upperLimit2}`)
          .or(`${third} LIKE '${like}'`)
          .render();

        expect(query2).toBe(expected2);
        db.get(query2);
      });
    });
    describe("and/or", () => {
      test("where-clauses can be combined with ors and ands", () => {
        // eslint-disable-next-line max-len
        const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} OR ${first} < ${upperLimit} AND ${second} < ${upperLimit2}`;
        const query = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .or(`${first} < ${upperLimit}`)
          .and(`${second} < ${upperLimit2}`)
          .render();

        expect(query).toBe(expected);
        db.get(query);

        // eslint-disable-next-line max-len
        const expected2 = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} AND ${first} < ${upperLimit} OR ${second} < ${upperLimit2} OR ${third} LIKE '${like}'`;
        const query2 = select(first, second, third)
          .from(table)
          .where(`${first} > ${lowerLimit}`)
          .and(`${first} < ${upperLimit}`)
          .or(`${second} < ${upperLimit2}`)
          .or(`${third} LIKE '${like}'`)
          .render();

        expect(query2).toBe(expected2);
        db.get(query2);
      });
    });
  });
});
