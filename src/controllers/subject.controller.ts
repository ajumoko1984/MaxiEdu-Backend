import { Response } from "express";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import { ExpressRequest } from "../app";
import subjectRepository from "../repository/subject.repository";

const logger = new Logger("Subject Controller");

class SubjectController {
   // Add subject
   async addSubject(req: ExpressRequest, res: Response) {
     try {
       const schoolId = req.params.schoolId;
       const { name, code, classId, description, departmentHeadId } = req.body;
 
       const exists = await subjectRepository.findOne({ name });
       if (exists) {
         return ResponseHandler.sendErrorResponse({
           res,
           code: HTTP_CODES.CONFLICT,
           error: "Subject with this name already exists",
         });
       }
 
       const subject = await subjectRepository.create({
         schoolId,
         name,
         code,
         classId,
         description,
         departmentHeadId,
       });
 
       return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.CREATED,
         message: "Subject added successfully",
         data: subject,
       });
     } catch (error: any) {
       logger.error(`Error in addSubject: ${error.message}`);
       return ResponseHandler.sendErrorResponse({
         res,
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: "Internal server error",
       });
     }
   }

   // List subjects
   async listSubjects(req: ExpressRequest, res: Response) {
     try {
       const schoolId = req.params.schoolId;
       const subjects = await subjectRepository.findAllBySchool(schoolId, req.query);
       return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Subjects retrieved", data: subjects });
     } catch (error: any) {
       logger.error(`Error in listSubjects: ${error.message}`);
       return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
     }
   }

   // Get subject
   async getSubject(req: ExpressRequest, res: Response) {
     try {
       const id = req.params.id;
       const subject = await subjectRepository.findOne({ id });
       if (!subject) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Subject not found" });
       return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Subject retrieved", data: subject });
     } catch (error: any) {
       logger.error(`Error in getSubject: ${error.message}`);
       return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
     }
   }

   async getSubjectsByClass(req: ExpressRequest, res: Response) {
  try {
    const { classId } = req.params;
    const subjects = await subjectRepository.findByClass({ classId });
       if (!subjects) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Subjects not found" });

           return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Subjects retrieved", data: subjects });
  } catch (err: any) {
    logger.error(`Error in getSubjectsByClass: ${err.message}`);
       return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
  }
};

   // Update subject
   async updateSubject(req: ExpressRequest, res: Response) {
     try {
       const id = req.params.id;
       const updated = await subjectRepository.atomicUpdate({ id }, req.body);
       if (!updated) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Subject not found" });
       return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Subject updated", data: updated });
     } catch (error: any) {
       logger.error(`Error in updateSubject: ${error.message}`);
       return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
     }
   }

   // Delete subject
   async deleteSubject(req: ExpressRequest, res: Response) {
     try {
       const id = req.params.id;
       const ok = await subjectRepository.deleteOne({ id });
       if (!ok) return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Subject not found" });
       return ResponseHandler.sendSuccessResponse({ res, code: HTTP_CODES.OK, message: "Subject deleted" });
     } catch (error: any) {
       logger.error(`Error in deleteSubject: ${error.message}`);
       return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
     }
   }

}


export default new SubjectController();
