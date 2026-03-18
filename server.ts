import express from "express";
import { Resend } from "resend";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());
const PORT = 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

app.post("/api/send-email", async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    const data = await resend.emails.send({
      from: "English Therapy <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    res.json(data);
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/api/reset-demo-data", async (req, res) => {
  try {
    // Transactional deletion using Supabase admin
    const tables = [
      "attendance", "fee_payments", "exam_results", "quiz_results",
      "student_xp", "streaks", "badges", "chat_messages",
      "students", "teacher_schedules", "teachers",
      "homework_assignments", "exam_records", "course_notes",
      "class_schedules", "certificates", "fee_records",
      "expense_records", "id_card_data", "leaderboard_entries"
    ];

    for (const table of tables) {
      await supabaseAdmin.from(table).delete().neq("id", "0"); // Assuming all have id
    }

    await supabaseAdmin.from("audit_logs").insert({
      action: "reset_demo_data",
      created_at: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ error: "Failed to reset demo data" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
