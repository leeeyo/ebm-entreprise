import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

export const CONTACT_SUBMISSION_STATUSES = ["new", "read", "callback", "assigned", "closed"] as const;

const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    serviceInterest: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    sourcePage: { type: String, default: "/contact", trim: true },
    status: {
      type: String,
      enum: CONTACT_SUBMISSION_STATUSES,
      default: "new",
      index: true,
    },
    assignedTo: { type: String, trim: true },
    internalNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

export type ContactSubmissionDoc = InferSchemaType<typeof ContactSubmissionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ContactSubmission =
  models.ContactSubmission ?? model("ContactSubmission", ContactSubmissionSchema);
