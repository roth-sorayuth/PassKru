import { Router } from "express";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import * as authService from "../services/authService.js";

const router = Router();

// IMPORTANT: raw body is required for Svix verification
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("Missing CLERK_WEBHOOK_SECRET");
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: "Missing svix headers" });
    }

    const payload = req.body;
    const body = payload.toString("utf8");

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const eventType = evt.type;
    const data = evt.data;

    if (eventType === "user.created" || eventType === "user.updated") {
      const clerkId = data.id;
      const email =
        data.email_addresses?.[0]?.email_address ||
        data.primary_email_address ||
        null;
      const firstName = data.first_name || "";
      const lastName = data.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || "User";

      try {
        // Adjust these function names to match your authService
        await authService.upsertUserFromClerk?.({
          clerkId,
          email,
          fullName,
          firstName,
          lastName,
        });

        // Fallback example if you only have create/update separately:
        // const existing = await authService.getUserByClerkId(clerkId);
        // if (existing) await authService.updateUser(...)
        // else await authService.createUser(...)

        console.log(`Synced Clerk user ${clerkId} (${email})`);
      } catch (dbErr) {
        console.error("DB sync error:", dbErr);
        return res.status(500).json({ error: "Database error" });
      }
    }

    return res.status(200).json({ success: true });
  }
);

export default router;