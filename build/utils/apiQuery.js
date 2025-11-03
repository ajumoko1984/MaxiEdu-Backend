"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIQuery {
    constructor(query, queryString, alias) {
        this.query = query;
        this.queryString = queryString;
        this.alias = alias;
    }
    filter() {
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
    sort() {
        if (this.queryString.sort) {
            const sortFields = this.queryString.sort.split(",");
            sortFields.forEach((field, index) => {
                const [key, dir] = field.split(":");
                const direction = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";
                if (index === 0) {
                    this.query.orderBy(`${this.alias}.${key}`, direction);
                }
                else {
                    this.query.addOrderBy(`${this.alias}.${key}`, direction);
                }
            });
        }
        else {
            this.query.orderBy(`${this.alias}.createdAt`, "DESC");
        }
        return this;
    }
    limitFields() {
        const rawFields = this.queryString.fields;
        if (rawFields) {
            const fields = rawFields.split(",").map((field) => {
                const [alias, column] = field.includes(".")
                    ? field.split(".")
                    : [this.alias, field];
                return `${alias}.${column}`;
            });
            this.query.select(fields);
        }
        return this;
    }
    paginate() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).take(limit);
        return this;
    }
    getQuery() {
        return this.query;
    }
}
exports.default = APIQuery;
//# sourceMappingURL=apiQuery.js.map