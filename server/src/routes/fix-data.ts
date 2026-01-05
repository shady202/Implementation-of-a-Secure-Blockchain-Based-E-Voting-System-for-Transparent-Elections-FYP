import { Router } from "express";
import { query } from "../db";

const router = Router();

// Temporary endpoint to fix user data
router.post("/fix-user-data", async (req, res) => {
  try {
    const { studentId, department, year } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID required" });
    }

    // Update user with faculty and year
    const result = await query(
      `UPDATE voters 
       SET department = $1, year_of_study = $2, updated_at = NOW()
       WHERE student_id = $3
       RETURNING student_id, full_name, department, year_of_study, email`,
      [department || "School of Computing", year || 1, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Updated user data:", result.rows[0]);

    res.json({
      success: true,
      message: "User data updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Failed to update user data" });
  }
});

export default router;
