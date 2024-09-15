import jwt from 'jsonwebtoken'
export const isAuthenticated=async(req,res,next)=>{
   try {
    const token=req.cookies.token
    if(!token){
        return res.status(400).json({message:"User not authenticated", success:false}) 
    }
    const decode=await jwt.verify(token,'secret123')
    if(!decode)
        return res.status(400).json({message:"invalid token",success:false})
    req.id=decode.userId
    next()
   } catch (error) {
    console.log(error)
   }
}