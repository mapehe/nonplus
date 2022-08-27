import { describe, expect, test } from "@jest/globals";
import { select } from "../src/select";

describe("Joins", () => {
  describe("INNER JOIN", () => {
    test("a basic inner join can be created", () => {
      const table1 = "table_1";
      const table2 = "table_2";
      const first = "sex";
      const second = "age";
      const joinColumn = "id";

      // eslint-disable-next-line max-len
      const expected = `SELECT ${first}, ${second} FROM ${table1} INNER JOIN ${table2} ON ${table1}.${joinColumn} = ${table2}.${joinColumn}`;
      const query = select(first, second)
        .from(table1)
        .innerJoin(table2)
        .on(`${table1}.${joinColumn} = ${table2}.${joinColumn}`)
        .render();

      expect(query).toBe(expected);
    });

    test("an inner join combines correctly with a where-clause", () => {
      const table1 = "table_1";
      const table2 = "table_2";
      const first = "sex";
      const second = "age";
      const joinColumn = "id";
      const lowerLimit = 20;

      // eslint-disable-next-line max-len
      const expected = `SELECT ${first}, ${second} FROM ${table1} INNER JOIN ${table2} ON ${table1}.${joinColumn} = ${table2}.${joinColumn} WHERE ${table1}.${second} > ${lowerLimit}`;
      const query = select(first, second)
        .from(table1)
        .innerJoin(table2)
        .on(`${table1}.${joinColumn} = ${table2}.${joinColumn}`)
        .where(`${table1}.${second} > ${lowerLimit}`)
        .render();

      expect(query).toBe(expected);
    });
  });
});
