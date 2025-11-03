import jwt from "jsonwebtoken";
import { SERVER_TOKEN_SECRET } from "../config/env.config";

export const verifyToken = async (token: any) => {
  try {
    const decoded = jwt.verify(token, `${SERVER_TOKEN_SECRET}`);
    return { status: true, decoded };
  } catch (err) {
    return { status: false, error: err };
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email?.toLowerCase().trim());
};

export function throwIfUndefined<T>(x: T | undefined, name?: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}

export function generateReceiptNo(): string {
  const receiptNo = Math.floor(100000 + Math.random() * 900000).toString();

  return `Kolak-${receiptNo.toString()}`;
}

export function incrementHospitalNumber(current: string): string {
  const [prefix, numberPart] = current.split("-");
  const nextNumber = parseInt(numberPart) + 1;
  return `${prefix}-${nextNumber.toString().padStart(6, "0")}`;
}

export const NormalizeTransformer = {
  to: (value?: string) => value?.trim().toLowerCase() || "",
  from: (value?: string) => value || "",
};
