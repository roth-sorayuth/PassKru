import { prisma } from "../config/prisma.js";

export const getUserByClerkId = async (clerkId) => {
  return prisma.user.findUnique({
    where: { clerkId },
  });
};

export const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUserFromClerk = async ({
  clerkId,
  email,
  firstName,
  lastName,
}) => {
  if (email) {
    const existing = await getUserByEmail(email);
    if (existing) {
      return prisma.user.update({
        where: { email },
        data: {
          clerkId,
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName,
        },
      });
    }
  }

  return prisma.user.create({
    data: {
      clerkId,
      email: email || `${clerkId}@clerk.local`,
      firstName: firstName || "User",
      lastName: lastName || "",
      passwordHash: "managed-by-clerk",
      role: "candidate",
    },
  });
};

export const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { userId: Number(userId) },
  });
};