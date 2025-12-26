export interface CreateSchoolDto {
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  principalName?: string;
  description?: string;
  registrationNumber?: string;
  state?: string;
  city?: string;
}

export interface UpdateSchoolDto {
  name?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  principalName?: string;
  description?: string;
  registrationNumber?: string;
  state?: string;
  city?: string;
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface SchoolResponseDto {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  principalName?: string;
  description?: string;
  registrationNumber?: string;
  state?: string;
  city?: string;
  isActive: boolean;
  isDisabled: boolean;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  createdAt: Date;
  updatedAt: Date;
}
