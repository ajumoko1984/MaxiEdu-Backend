import { Response } from "express";
import { ExpressRequest } from "../app";
import studentRepository from "../repository/student.repository";
import ResponseHandler from "../utils/response-handler";
import { HTTP_CODES } from "../config/constants";
import Logger from "../utils/logger";
import Joi from "joi";

const logger = new Logger("RFID Controller");

class RfidController {
  // Utility: generate prefixed code
private generateRfidCode(role: "STU" | "TCH", schoolCode: string, year: number, rfidUid: string) {
  const shortUid = rfidUid.slice(-6).toUpperCase(); // last 6 chars
  const shortYear = year % 100; // 26 for 2026
  return `${role}-${schoolCode}-${shortYear}-${shortUid}`;
}

// Assign RFID (first time)
async assignRfid(req: ExpressRequest, res: Response) {
  try {
    const schema = Joi.object({
      rfidUid: Joi.string().pattern(/^[A-Fa-f0-9]+$/).min(8).max(32).optional(),
      role: Joi.string().valid("STU", "TCH").required(),
      schoolCode: Joi.string().min(2).max(5).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: error.message });
    }

    let { rfidUid, role, schoolCode } = value;
    const year = new Date().getFullYear();

    const student = await studentRepository.findOne({ id: req.params.id });
    if (!student) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Student not found" });
    }

    if (student.rfidAssigned) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: "RFID already assigned to this student" });
    }

    // Auto-generate UID if not provided
    if (!rfidUid) {
      rfidUid = Math.random().toString(16).slice(2, 10).toUpperCase(); // e.g., "04A1BC9F"
    }

    // Check if UID is already in use
    const exists = await studentRepository.findOne({ rfidUid });
    if (exists) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.CONFLICT, error: "RFID UID already in use" });
    }

    const rfidCode = this.generateRfidCode(role as "STU" | "TCH", schoolCode, year, rfidUid);

    await studentRepository.atomicUpdate({ id: req.params.id }, {
      rfidUid,
      rfidCode,
      rfidAssigned: true
    });

    return ResponseHandler.sendSuccessResponse({
      res,
      code: HTTP_CODES.OK,
      message: "RFID assigned successfully",
      data: { rfidCode, rfidUid }
    });
  } catch (err: any) {
    logger.error(`Error in assignRfid: ${err.message}`);
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
  }
}


  // Verify RFID (tap card)
  async verifyRfid(req: ExpressRequest, res: Response) {
    try {
      const schema = Joi.object({
        rfidUid: Joi.string().pattern(/^[A-Fa-f0-9]+$/).min(8).max(32).required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: error.message });
      }

      const { rfidUid } = value;
      const student = await studentRepository.findOne({ rfidUid });

      if (!student || !student.rfidAssigned) {
        return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "RFID not recognized or not assigned" });
      }

      return ResponseHandler.sendSuccessResponse({
        res,
        code: HTTP_CODES.OK,
        message: "RFID verified successfully",
        data: {
          studentId: student.id,
          fullName: `${student.firstName} ${student.lastName}`,
          rfidCode: student.rfidCode
        }
      });
    } catch (err: any) {
      logger.error(`Error in verifyRfid: ${err.message}`);
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
    }
  }

// Replace RFID for a student
replaceRfid = async (req: ExpressRequest, res: Response) => {
  try {
    const schema = Joi.object({
      rfidUid: Joi.string().pattern(/^[A-Fa-f0-9]+$/).min(8).max(32).optional(), // optional now
      role: Joi.string().valid("STU", "TCH").required(),
      schoolCode: Joi.string().min(2).max(5).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: error.message });
    }

    let { rfidUid, role, schoolCode } = value;
    const year = new Date().getFullYear();

    const student = await studentRepository.findOne({ id: req.params.id });
    if (!student) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: "Student not found" });
    }

    // Generate a new UID if none provided
    if (!rfidUid) {
      rfidUid = Math.random().toString(16).slice(2, 10).toUpperCase(); // e.g., "04A1BC9F"
    }

    // Check if the new UID is already in use
    const exists = await studentRepository.findOne({ rfidUid });
    if (exists) {
      return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.CONFLICT, error: "RFID UID already in use" });
    }

    // Generate new RFID code
    const rfidCode = this.generateRfidCode(role as "STU" | "TCH", schoolCode, year, rfidUid);

    // Update student with new RFID
    await studentRepository.atomicUpdate({ id: req.params.id }, {
      rfidUid,
      rfidCode,
      rfidAssigned: true
    });

    return ResponseHandler.sendSuccessResponse({
      res,
      code: HTTP_CODES.OK,
      message: "RFID replaced successfully",
      data: { rfidUid, rfidCode }
    });

  } catch (err: any) {
    logger.error(`Error in replaceRfid: ${err.message}`);
    return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.INTERNAL_SERVER_ERROR, error: "Internal server error" });
  }
};

}

export default new RfidController();
