import bcrypt from "bcryptjs";
const newHash = await bcrypt.hash("password123", 10);
console.log("New hash for password123:", newHash);
