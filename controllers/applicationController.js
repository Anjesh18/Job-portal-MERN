import { Application } from "../models/Applications.model.js";
import { Job } from "../models/Jobs.model.js";
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Job id is required", success: false });
    }
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "Already applied", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ message: "Job not found", success: false });
    }
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    if (!newApplication) {
      return res
        .status(400)
        .json({ message: "some error occured", success: false });
    }
    job.applications.push(newApplication._id);
    await job.save();
    return res
      .status(201)
      .json({ message: "Job aplied successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res
        .status(400)
        .json({ message: "No application", success: false });
    }
    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: {
        sort: { createdAt: -1 },
        populate: {
          path: "applicant",
        },
      },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: true });
    }
    return res.status(201).json({
      job,
      success: true,
    });
  } catch (error) {}
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(404).json({ success: false });
    }
    const update = await Application.findByIdAndUpdate(
      applicationId,
      { status: status.toLowerCase() },
      { new: true }
    );
    res.status(201).json({ success: true, update });
  } catch (error) {
    console.log(error);
  }
};
