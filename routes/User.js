import express from 'express'
import { login,logout,register, updateProfile } from '../controllers/userController.js'
import { isAuthenticated } from '../middlewares/Auth.js'
export const router=express.Router()

router.post('/register', register)
router.post("/login", login)
router.get('/logout', logout )
router.put('/profile/update', isAuthenticated, updateProfile)







