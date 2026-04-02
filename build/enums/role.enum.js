"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceType = exports.WEEKDAYS = exports.AVAILABILITY = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["SUPER_ADMIN"] = "super-admin";
    ROLE["ADMIN"] = "admin";
    ROLE["OTHER_STAFF"] = "other-staff";
    ROLE["STUDENT"] = "student";
    ROLE["TEACHER"] = "teacher";
    ROLE["HR"] = "hr";
})(ROLE || (exports.ROLE = ROLE = {}));
var AVAILABILITY;
(function (AVAILABILITY) {
    AVAILABILITY["AVAILABLE"] = "available";
    AVAILABILITY["BORROWED"] = "borrowed";
})(AVAILABILITY || (exports.AVAILABILITY = AVAILABILITY = {}));
var WEEKDAYS;
(function (WEEKDAYS) {
    WEEKDAYS["MONDAY"] = "Monday";
    WEEKDAYS["TUESDAY"] = "Tuesday";
    WEEKDAYS["WEDNESDAY"] = "Wednesday";
    WEEKDAYS["THURSDAY"] = "Thursday";
    WEEKDAYS["FRIDAY"] = "Friday";
    WEEKDAYS["SATURDAY"] = "Saturday";
    WEEKDAYS["SUNDAY"] = "Sunday";
})(WEEKDAYS || (exports.WEEKDAYS = WEEKDAYS = {}));
var AttendanceType;
(function (AttendanceType) {
    AttendanceType["STUDENT"] = "STU";
    AttendanceType["TEACHER"] = "TCH";
})(AttendanceType || (exports.AttendanceType = AttendanceType = {}));
//# sourceMappingURL=role.enum.js.map