import {
  WhereQuery,
  Query,
  IncompleteQuery,
  IncompleteInnerJoin,
} from "./types";

type FromFactoryParams = {
  columns: string[];
};

type WhereFactoryParams = FromFactoryParams & {
  table: string;
};

type OnFactoryParams = WhereFactoryParams;

type ToStringFactoryParams = WhereFactoryParams & {
  whereClause?: string;
  joins?: string;
};

type InnerJoinFactoryParams = WhereFactoryParams;

const toStringFactory =
  ({ columns, table, whereClause }: ToStringFactoryParams) =>
  () =>
    `SELECT ${columns.join(", ")} FROM ${table}${
      whereClause ? ` WHERE ${whereClause}` : ""
    }`;

const whereQueryFacory = (
  columns: string[],
  table: string,
  whereClause: string
): WhereQuery => ({
  render: toStringFactory({ columns, table, whereClause }),
  and: (andClause: string) =>
    whereQueryFacory(columns, table, `${whereClause} AND ${andClause}`),
  or: (orClause: string) =>
    whereQueryFacory(columns, table, `${whereClause} OR ${orClause}`),
});

const whereFactory =
  ({ columns, table }: WhereFactoryParams) =>
  (whereClause: string) => ({
    render: toStringFactory({ columns, table, whereClause }),
    and: (andClause: string) =>
      whereQueryFacory(columns, table, `${whereClause} AND ${andClause}`),
    or: (orClause: string) =>
      whereQueryFacory(columns, table, `${whereClause} OR ${orClause}`),
  });

const appendJoinCondition = (table: string, joinCondition: string) =>
  `${table} ON ${joinCondition}`;

const onFactory =
  ({ columns, table: incompleteTarget }: OnFactoryParams) =>
  (joinCondition: string): Query => {
    const table = appendJoinCondition(incompleteTarget, joinCondition);
    const params = { columns, table };
    return {
      render: toStringFactory(params),
      where: whereFactory(params),
      innerJoin: innerJoinFactory(params),
    };
  };

const innerJoinFactory =
  ({ columns, table }: InnerJoinFactoryParams) =>
  (targetTable: string): IncompleteInnerJoin => ({
    on: onFactory({ columns, table: `${table} INNER JOIN ${targetTable}` }),
  });

const fromFactory =
  ({ columns }: FromFactoryParams) =>
  (table: string): Query => ({
    render: toStringFactory({ columns, table }),
    where: whereFactory({ columns, table }),
    innerJoin: innerJoinFactory({ columns, table }),
  });

export const all: IncompleteQuery = {
  from: fromFactory({ columns: ["*"] }),
};

export const select = (...columns: string[]): IncompleteQuery => ({
  from: fromFactory({ columns }),
});
