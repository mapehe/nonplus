export interface WhereQuery {
  render: () => string;
  and: (whereStatement: string) => WhereQuery;
  or: (whereStatement: string) => WhereQuery;
}

export interface Query {
  render: () => string;
  where: (whereStatement: string) => WhereQuery;
}

export interface IncompleteQuery {
  from: (table: string) => Query;
}
