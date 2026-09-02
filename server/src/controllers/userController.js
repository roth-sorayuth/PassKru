import * as userService from "../services/userService.js";

export async function getUsersHandler(req, res) {
  try {
    const { role, targetExamId, search } = req.query;
    const users = await userService.getAllUsers({ role, targetExamId, search });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
    });
  }
}

export async function getUserByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(error.message === "User not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createUserHandler(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
}

export async function updateUserHandler(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
}

export async function deleteUserHandler(req, res) {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
}
