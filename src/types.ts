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
