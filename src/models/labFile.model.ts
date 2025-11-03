// Minimal stub model for file uploads to satisfy build and local dev.
// Replace with real Mongoose schema/model when integrating with storage.

const LabFileModel: any = {
  async create(payload: { name: string; mimetype: string; data: Buffer }) {
    // In prod, save to DB or cloud storage and return saved document
    return { _id: String(Date.now()), name: payload.name, mimetype: payload.mimetype };
  },
};

export default LabFileModel;
