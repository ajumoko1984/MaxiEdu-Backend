export interface CreateSchoolAdminDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  schoolId?: string;
}
