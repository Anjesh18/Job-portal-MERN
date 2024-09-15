import {Company} from '../models/Company.model.js'

export const registerCompany=async(req,res)=>{
    try {
        const {companyName}=req.body
        if(!companyName){
            res.status(404).json({message:"Company name is required", success:false})
        }
        const company=await Company.findOne({companyName})
        if(company){
            return res.status(400).json({message:"Company already exists", success:false})
        }
        const newCompany=await Company.create({name:companyName,
            userId: req.id
        })
        res.status(201).json({message:"Company resgistered successfully", success: true, newCompany})
    } catch (error) {
        console.log(error)
    }
}

export const getCompany=async(req,res)=>{
    try {
        const userId=req.id
        const companies=await Company.find({userId})
        if(!companies){
            res.status(404).json({message:"Companies not found", success: false})
        }
        return res.status(201).json({companies, success:true})
    } catch (error) {
        console.log(error)
    }
}  


export const getCompanyById=async(req,res)=>{
    try {
        const {id}=req.params
        const company=await Company.findById({id})
        if(!company){
            res.status(404).json({message:"Company not found", success: false})
        }
        return res.status(201).json({company, success:true})
    } catch (error) {
        console.log(error)
    }
}


export const updateCompany=async(req,res)=>{
    try {
        const {name,description, website, location}=req.body
        const file=req.file
        const updateCompany=await Company.findByIdAndUpdate(req.params.id, {
            name:name,
            desciption: description,
            website: website,
            location: location
        }, {new:true})
        if(!updateCompany){
            return res.status(404).json({success: false})
        }
        return res.status(201).json({message:"Company info updated",success: true, updateCompany})
    } catch (error) {
        console.log(error)
    }
}