import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/companyController.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/Auth.js";
export const companyRouter=express.Router()

companyRouter.post('/register', isAuthenticated,registerCompany)
companyRouter.get('/get',isAuthenticated, getCompany)
companyRouter.get('/get/:id',isAuthenticated, getCompanyById) 
companyRouter.put('/update/:id',isAuthenticated, updateCompany)