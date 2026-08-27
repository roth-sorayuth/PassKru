// import jwt from "jsonwebtoken";
// import * as authService from "../services/authService.js";

// const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_12345";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized to access this route, token missing",
//     });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Get user from database
//     const user = await authService.getUserById(decoded.userId);
//     req.user = user;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized to access this route, invalid or expired token",
//     });
//   }
// };

import { verifyToken, createClerkClient } from "@clerk/express";
import * as authService from "../services/authService.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing Bearer token",
      });
    }

    const token = authHeader.split(" ")[1];

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      clockSkewInMs: 10000,
      // Do NOT set authorizedParties until verify works
    });

    if (!verified?.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid token subject",
      });
    }

    const clerkId = verified.sub;
    console.log("[protect] clerkId:", clerkId);

    let user = await authService.getUserByClerkId(clerkId);
    console.log("[protect] found in DB:", !!user);

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || null;
      const firstName = clerkUser.firstName || "";
      const lastName = clerkUser.lastName || "";

      console.log("[protect] creating:", { clerkId, email });

      user = await authService.createUserFromClerk({
        clerkId,
        email,
        firstName,
        lastName,
      });

      console.log("[protect] created userId:", user?.userId);
    }

    req.user = user;
    req.auth = {
      userId: clerkId,
      dbUserId: user.userId,
    };

    next();
  } catch (error) {
    console.error("[protect] ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Auth failed",
      detail: error?.message || String(error),
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized as an admin",
    });
  }
};

