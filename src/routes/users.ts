import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/usersController";

const router = Router();

// CREATE - POST /api/users
router.post("/", createUser);

// READ - GET /api/users
router.get("/", getAllUsers);

// READ - GET /api/users/:id
router.get("/:id", getUserById);

// UPDATE - PUT /api/users/:id
router.put("/:id", updateUser);

// DELETE - DELETE /api/users/:id
router.delete("/:id", deleteUser);

export default router;
