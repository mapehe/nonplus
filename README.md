⚠️ This project is in a highly experimental phase and is not ready for serious
use. ⚠️

# nonplus - a minimal TypeScript SQL query builder

**nonplus** is a zero-abstraction SQL query builder. It strives to minimize the
mental overhead and human errors in use cases, where a Node app has to access
the database through raw SQL. It's **not** and ORM, or even a database binding
of any kind. The one and only purpose of nonplus is to build SQL query strings
with improved developer experience in comparison to manual string-value
manipulation, while trying to be maximally ergonomic through the TypeScript type
system.

## Example usage

A simple query:

```typescript
/*
  query will equal:

  SELECT age, height FROM person
*/
const query = select("age", "height").from("person").render();
```

A query with WHERE-statements:

```typescript
/*
  query will equal (up to formatting):

  SELECT age, height, sex
  FROM person
  WHERE age > 15
    OR height > 180
    AND sex = 'M'
*/
const query = select("age", "height", "sex")
  .from("person")
  .where("age > 15")
  .or("height > 180")
  .and("sex = 'M'")
  .render();
```

A query with an INNER JOIN:

```typescript
/*
  query will equal (up to formatting):

  SELECT person.age, address.street
  FROM person
  INNER JOIN address
  ON person.id = address.person_id
  WHERE person.height > 180
*/
const query = select("person.age", "address.street")
  .from("person")
  .innerJoin("address")
  .on("person.id = address.person_id")
  .where("person.height > 180")
  .render();
```

TypeScript will catch a lot of invalid queries. For example
```typescript
const invalidQuery = select("person.age", "address.street")
  .from("person")
  .innerJoin("address")
  .render()
```
will not work, because of the missing `.on`.
