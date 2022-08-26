import { WhereQuery, Query, IncompleteQuery } from "./types";

const toStringFactory =
  (terms: string[], tableName: string, whereClause?: string) => () =>
    `SELECT ${terms.join(", ")} FROM ${tableName}${
      whereClause ? ` WHERE ${whereClause}` : ""
    }`;

const whereQueryFacory = (
  columns: string[],
  table: string,
  whereClause: string
): WhereQuery => ({
  toString: toStringFactory(columns, table, whereClause),
  and: (andClause: string) =>
    whereQueryFacory(columns, table, `${whereClause} AND ${andClause}`),
  or: (orClause: string) =>
    whereQueryFacory(columns, table, `${whereClause} OR ${orClause}`),
});

const whereFactory =
  (columns: string[], table: string) => (whereClause: string) => ({
    toString: toStringFactory(columns, table, whereClause),
    and: (andClause: string) =>
      whereQueryFacory(columns, table, `${whereClause} AND ${andClause}`),
    or: (orClause: string) =>
      whereQueryFacory(columns, table, `${whereClause} OR ${orClause}`),
  });

const fromFactory =
  (columns: string[]) =>
  (table: string): Query => ({
    toString: toStringFactory(columns, table),
    where: whereFactory(columns, table),
  });

export const all: IncompleteQuery = {
  from: fromFactory(["*"]),
};

export const select = (...columns: string[]): IncompleteQuery => ({
  from: fromFactory(columns),
});
