// import Task  from "../../models/Task.js";

// export const getAllTasks = async (request, response) => {
//     try {
//         const tasks = await Task.find().sort({createdAt: -1});
//         //find() la lay tat ca du lieu trong collection
//         //.sort({createdAt: -1}) sap xep giam dan theo thoi gian tao
//         response.status(200).json(tasks);
//     } catch (error) {
//         console.error("Lỗi lấy danh sách task", error);
//         response.status(500).json({ message: "Error server" });
//     }
// };

// export const createTask = async (request, response) => {
//     try {
//         const {title} = request.body;

//         const task = new Task({title});

//         const newTask = await task.save();

//         response.status(201).json(newTask);
//     } catch (error) {
        
//         console.error("Lỗi tạo task", error);
//         response.status(500).json({ message: "Error server" });
//     }
// };

// export const updateTask = async (request, response) => {
//     try {
//         const {title,status, completed} = request.body;

//         const updatedTask = await Task.findByIdAndUpdate(
//             request.params.id,
//             {  
//                 title,
//                 status, 
//                 completed
//             },
//             {new : true}
//         );
//         if(!updateTask){
//             return request.status
//         }

//         response.status(200).json(updatedTask);

//     } catch (error) {
//         console.error("Lỗi update task", error);
//         response.status(500).json({ message: "Error server" });
//     }
// };

// export const deleteTask = async (request, response) => {
//     try {
//         const deleteTask = await Task.findByIdAndDelete(request.params.id);
//         if(!deleteTask){
//             return response.status(404).json({message: "Task not found"});
//         }
//         response.status(200).json({message: "Task deleted successfully"});
//     } catch (error) {
//         console.error("Lỗi update task", error);
//         response.status(500).json({ message: "Error server" });
//     }
// };