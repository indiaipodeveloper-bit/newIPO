import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all sectors with IPO counts
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        s.*,
        COUNT(CASE WHEN LOWER(i.issue_category) IN ('mainline', 'mainboard') THEN 1 END) as mainline_count,
        COUNT(CASE WHEN LOWER(i.issue_category) = 'sme' THEN 1 END) as sme_count,
        COUNT(i.id) as total_count
      FROM sectors s
      LEFT JOIN ipo_lists i ON s.id = i.sector_id
      WHERE s.status = 'Active'
      GROUP BY s.id
      ORDER BY s.name ASC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sectors with counts:", error);
    res.status(500).json({ error: "Failed to fetch sector data" });
  }
});

// GET all sectors for admin (includes inactive)
router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM sectors ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sectors" });
  }
});

// POST new sector
router.post("/", async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO sectors (name, description, status) VALUES (?, ?, ?)",
      [name, description, status || 'Active']
    );
    res.status(201).json({ id: result.insertId, message: "Sector created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create sector" });
  }
});

// PUT update sector
router.put("/:id", async (req, res) => {
  try {
    const { name, description, status } = req.body;
    await pool.query(
      "UPDATE sectors SET name = ?, description = ?, status = ? WHERE id = ?",
      [name, description, status, req.params.id]
    );
    res.json({ message: "Sector updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update sector" });
  }
});

// DELETE sector
router.delete("/:id", async (req, res) => {
  try {
    // Check if sector is in use
    const [inUse] = await pool.query("SELECT id FROM ipo_lists WHERE sector_id = ? LIMIT 1", [req.params.id]);
    if (inUse.length > 0) {
      return res.status(400).json({ error: "Cannot delete sector as it is currently linked to one or more IPOs" });
    }
    await pool.query("DELETE FROM sectors WHERE id = ?", [req.params.id]);
    res.json({ message: "Sector deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete sector" });
  }
});

export default router;
