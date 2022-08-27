/* eslint-disable no-use-before-define */
export interface WhereQuery {
  render: () => string;
  and: (whereStatement: string) => WhereQuery;
  or: (whereStatement: string) => WhereQuery;
}

export interface Query {
  render: () => string;
  where: (whereStatement: string) => WhereQuery;
  innerJoin: (query: string) => IncompleteInnerJoin;
}

export interface IncompleteInnerJoin {
  on: (condition: string) => Query;
}

export interface IncompleteQuery {
  from: (table: string) => Query;
}
