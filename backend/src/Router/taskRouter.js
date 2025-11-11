import express from "express";
// import { updateTask,createTask, getAllTasks, deleteTask} from  "../controller/taskController.js";
import {createTask} from  "../Controller/taskController.js";

const router = express.Router();

// router.get("/" , getAllTasks);

router.post("/", createTask);

// router.put("/:id" , updateTask);



// router.delete("/:id" , deleteTask);

export default router;