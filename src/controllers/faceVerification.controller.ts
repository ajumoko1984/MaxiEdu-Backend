import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import studentRepository from "../repository/student.repository";

const logger = new Logger("Face Verification Controller");


function euclideanDistance(a: number[], b: number[]) {
  if (a.length !== b.length) {
    throw new Error("Face descriptors must be the same length");
  }

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}


class FaceVerificationController {

      // Enroll face (first-time only)
    async enrollFace(req: ExpressRequest, res: Response) {
      try {
        const id = req.params.id;
        const { faceDescriptor } = req.body;
    
        // Find student
        const student = await studentRepository.findOne({ id });
        if (!student) {
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.NOT_FOUND,
            error: "Student not found",
          });
        }
    
        // Prevent overwrite
        if (student.faceEnrolled) {
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.BAD_REQUEST,
            error: "Face already enrolled for this student",
          });
        }
    
        // Save face data
        const updated = await studentRepository.atomicUpdate(
          { id },
          {
            faceDescriptor,
            faceEnrolled: true,
          }
        );
    
        if (!updated) {
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.NOT_FOUND,
            error: "Student not found",
          });
        }
    
        return ResponseHandler.sendSuccessResponse({
          res,
          code: HTTP_CODES.OK,
          message: "Face enrolled successfully",
          data: {
            id: updated.id,
            faceEnrolled: updated.faceEnrolled,
          },
        });
      } catch (error: any) {
        logger.error(`Error in enrollFace: ${error.message}`);
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.INTERNAL_SERVER_ERROR,
          error: "Internal server error",
        });
      }
    }
    
    // Verify face (live check)
    async verifyFace(req: ExpressRequest, res: Response) {
      try {
        const id = req.params.id;
        const { liveFaceDescriptor } = req.body;
    
        const student = await studentRepository.findOne({ id });
        if (!student) {
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.NOT_FOUND,
            error: "Student not found",
          });
        }
    
        if (!student.faceEnrolled || !student.faceDescriptor) {
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.BAD_REQUEST,
            error: "Face not enrolled for this student",
          });
        }
    
        const distance = euclideanDistance(
          liveFaceDescriptor,
          student.faceDescriptor
        );
    
        const THRESHOLD = 0.6;
    
        if (distance > THRESHOLD) {
          return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.UNAUTHORIZED,
            error: "Face verification failed",
          });
        }
    
        return ResponseHandler.sendSuccessResponse({
          res,
          code: HTTP_CODES.OK,
          message: "Face verified successfully",
          data: {
            distance,
            verified: true,
          },
        });
      } catch (error: any) {
        logger.error(`Error in verifyFace: ${error.message}`);
        return ResponseHandler.sendErrorResponse({
          res,
          code: HTTP_CODES.INTERNAL_SERVER_ERROR,
          error: "Internal server error",
        });
      }
    }
    
    
    }

    export default new FaceVerificationController();
    