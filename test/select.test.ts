import { describe, expect, test } from "@jest/globals";
import { all, select } from "../src/select";

describe("Table", () => {
  test("a simple query can be created", () => {
    const table = "table";
    const first = "age";
    const second = "height";
    const third = "sex";

    const expected = `SELECT ${first}, ${second}, ${third} FROM ${table}`;
    const query = select(first, second, third).from(table).toString();

    expect(query).toBe(expected);
  });

  test("a 'select *' can be created", () => {
    const table = "table";

    const expected = `SELECT * FROM ${table}`;
    const query = all.from(table).toString();

    expect(query).toBe(expected);
  });

  test("a where-clause can be created", () => {
    const table = "table";
    const first = "age";
    const second = "height";
    const third = "sex";
    const limit = 10;

    const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${limit}`;
    const query = select(first, second, third)
      .from(table)
      .where(`${first} > ${limit}`)
      .toString();

    expect(query).toBe(expected);
  });

  test("a where-clauses can be combined with and", () => {
    const table = "table";
    const first = "age";
    const second = "height";
    const third = "sex";
    const lowerLimit = 10;
    const upperLimit = 60;

    // eslint-disable-next-line max-len
    const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} AND ${first} < ${upperLimit}`;
    const query = select(first, second, third)
      .from(table)
      .where(`${first} > ${lowerLimit}`)
      .and(`${first} < ${upperLimit}`)
      .toString();

    expect(query).toBe(expected);
  });

  test("a where-clauses can be combined with two ands", () => {
    const table = "table";
    const first = "age";
    const second = "height";
    const third = "sex";
    const lowerLimit = 10;
    const upperLimit = 60;
    const upperLimit2 = 180;

    // eslint-disable-next-line max-len
    const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} AND ${first} < ${upperLimit} AND ${second} < ${upperLimit2}`;
    const query = select(first, second, third)
      .from(table)
      .where(`${first} > ${lowerLimit}`)
      .and(`${first} < ${upperLimit}`)
      .and(`${second} < ${upperLimit2}`)
      .toString();

    expect(query).toBe(expected);
  });

  test("a where-clauses can be combined three ands", () => {
    const table = "table";
    const first = "age";
    const second = "height";
    const third = "sex";
    const lowerLimit = 10;
    const upperLimit = 60;
    const upperLimit2 = 180;
    const like = "M";

    // eslint-disable-next-line max-len
    const expected = `SELECT ${first}, ${second}, ${third} FROM ${table} WHERE ${first} > ${lowerLimit} AND ${first} < ${upperLimit} AND ${second} < ${upperLimit2} AND ${third} LIKE ${like}`;
    const query = select(first, second, third)
      .from(table)
      .where(`${first} > ${lowerLimit}`)
      .and(`${first} < ${upperLimit}`)
      .and(`${second} < ${upperLimit2}`)
      .and(`${third} LIKE ${like}`)
      .toString();

    expect(query).toBe(expected);
  });
});
