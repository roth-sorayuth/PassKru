import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (firstName, lastName, email, password)",
      });
    }

    const data = await authService.registerUser({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const data = await authService.loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // protect already populated req.user, but re-read with the exam relation
    // so the client can use targetExam.targetCode rather than mapping ids.
    const user = await authService.getUserWithExam(req.user.userId);
    return res.status(200).json({
      success: true,
      user: user || req.user,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/auth/me
export const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateOwnProfile(req.user.userId, req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
