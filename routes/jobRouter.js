import { postJob, getJob, getJobById,getAdminJobs } from "../controllers/jobController.js";
import { isAuthenticated } from "../middlewares/Auth.js";
import express from 'express'
export const jobRouter=express.Router()

jobRouter.post('/post',isAuthenticated, postJob)
jobRouter.get('/get',isAuthenticated, getJob)
jobRouter.get('/get/:id',isAuthenticated, getJobById)
jobRouter.get('/getadminjobs',isAuthenticated, getAdminJobs)