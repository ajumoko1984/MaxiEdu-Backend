"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongooseAPIQuery {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        const mongoQuery = JSON.parse(JSON.stringify(queryObj).replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`));
        this.query.find(mongoQuery);
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort
                .split(",")
                .map((field) => {
                const [key, dir] = field.split(":");
                return `${dir?.toLowerCase() === "desc" ? "-" : ""}${key}`;
            })
                .join(" ");
            this.query.sort(sortBy);
        }
        else {
            this.query.sort("-createdAt");
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query.select(fields);
        }
        return this;
    }
    paginate() {
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
        return this;
    }
    getQuery() {
        return this.query;
    }
}
exports.default = MongooseAPIQuery;
//# sourceMappingURL=mongooseApiQuery.js.map