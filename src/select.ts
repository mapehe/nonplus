export interface WhereQuery {
  toString: () => string;
  and: (whereStatement: string) => WhereQuery;
  or: (whereStatement: string) => WhereQuery;
}

export interface Query {
  toString: () => string;
  where: (whereStatement: string) => WhereQuery;
}

export interface IncompleteQuery {
  from: (table: string) => Query;
}

const toStringFactory =
  (terms: string[], tableName: string, whereStatement?: string) => () =>
    `SELECT ${terms.join(", ")} FROM ${tableName}${
      whereStatement ? ` WHERE ${whereStatement}` : ""
    }`;

const whereQueryFacory = (
  columns: string[],
  table: string,
  whereStatement: string
): WhereQuery => ({
  toString: toStringFactory(columns, table, whereStatement),
  and: (andStatement: string) =>
    whereQueryFacory(columns, table, `${whereStatement} AND ${andStatement}`),
  or: (andStatement: string) =>
    whereQueryFacory(columns, table, `${whereStatement} OR ${andStatement}`),
});

const whereFactory =
  (columns: string[], table: string) => (whereStatement: string) => ({
    toString: toStringFactory(columns, table, whereStatement),
    and: (andStatement: string) =>
      whereQueryFacory(columns, table, `${whereStatement} AND ${andStatement}`),
    or: (andStatement: string) =>
      whereQueryFacory(columns, table, `${whereStatement} OR ${andStatement}`),
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
