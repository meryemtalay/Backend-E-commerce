const express= require("express");
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getAllEnquiry } = require("../controller/enqCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router=express.Router()

router.post("/",createEnquiry)
router.put("/:id",authMiddleware,isAdmin,updateEnquiry)
router.get("/:id",getEnquiry)
router.get("/",getAllEnquiry)
router.delete("/:id",authMiddleware,isAdmin,deleteEnquiry)
module.exports=router;