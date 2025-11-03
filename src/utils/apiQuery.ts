import { SelectQueryBuilder, ObjectLiteral } from "typeorm";

class APIQuery<T extends ObjectLiteral> {
  private query: SelectQueryBuilder<T>;
  private queryString: any;
  private alias: string;

  constructor(query: SelectQueryBuilder<T>, queryString: any, alias: string) {
    this.query = query;
    this.queryString = queryString;
    this.alias = alias;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key]) {
        this.query.andWhere(`${this.alias}.${key} = :${key}`, {
          [key]: queryObj[key],
        });
      }
    });

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortFields = this.queryString.sort.split(",");
      sortFields.forEach((field: string, index: number) => {
        const [key, dir] = field.split(":");
        const direction = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
        if (index === 0) {
          this.query.orderBy(`${this.alias}.${key}`, direction);
        } else {
          this.query.addOrderBy(`${this.alias}.${key}`, direction);
        }
      });
    } else {
      this.query.orderBy(`${this.alias}.createdAt`, "DESC");
    }

    return this;
  }

  limitFields(): this {
    const rawFields = this.queryString.fields;

    if (rawFields) {
      const fields = rawFields.split(",").map((field: string) => {
        const [alias, column] = field.includes(".")
          ? field.split(".")
          : [this.alias, field];
        return `${alias}.${column}`;
      });

      this.query.select(fields);
    }

    return this;
  }

  paginate(): this {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query.skip(skip).take(limit);
    return this;
  }

  getQuery(): SelectQueryBuilder<T> {
    return this.query;
  }
}

export default APIQuery;
