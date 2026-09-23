const express=require("express");
const router=express.Router();

const auth=require("../middleware/authMiddleware");

const {

getNotes,
createNote,
updateNote,
deleteNote,
togglePin

}=require("../controllers/noteController");

router.use(auth);

router.get("/",getNotes);

router.post("/",createNote);

router.put("/:id",updateNote);

router.delete("/:id",deleteNote);

router.patch("/:id/pin",togglePin);

module.exports=router;