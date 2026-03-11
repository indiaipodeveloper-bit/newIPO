import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all mainboard bankers with search and pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    let countQuery = "SELECT COUNT(*) as total FROM merchant_bankers";
    let dataQuery = "SELECT * FROM merchant_bankers";
    const queryParams = [];

    if (search) {
      const searchClause = " WHERE title LIKE ? OR name LIKE ? OR category LIKE ? OR services LIKE ?";
      countQuery += searchClause;
      dataQuery += searchClause;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    dataQuery += " ORDER BY id DESC LIMIT ? OFFSET ?";
    const dataParams = [...queryParams, limit, offset];

    const [[{ total }]] = await pool.query(countQuery, queryParams);
    const [data] = await pool.query(dataQuery, dataParams);

    // Some legacy rows might have 'title' instead of 'name' or vice versa. Map gracefully
    const mappedData = data.map(row => ({
      ...row,
      name: row.title || row.name || "Unknown Banker"
    }));

    res.json({
      data: mappedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching mainboard bankers:", error);
    res.status(500).json({ error: "Failed to fetch mainboard bankers" });
  }
});

// GET single mainboard banker by ID
router.get("/:id", async (req, res) => {
  try {
    const [data] = await pool.query("SELECT * FROM merchant_bankers WHERE id = ?", [req.params.id]);
    if (data.length === 0) {
      return res.status(404).json({ error: "Banker not found" });
    }
    res.json(data[0]);
  } catch (error) {
    console.error("Error fetching single mainboard banker:", error);
    res.status(500).json({ error: "Failed to fetch banker" });
  }
});

// POST new mainboard banker
router.post("/", async (req, res) => {
  try {
    const {
      name, category, location, sebi_registration, website, services,
      total_ipos, established_year, description, logo_url, is_active,
      sort_order, total_raised, avg_size, avg_subscription
    } = req.body;

    const query = `
      INSERT INTO merchant_bankers 
      (name, category, location, sebi_registration, website, services, 
       total_ipos, established_year, description, logo_url, is_active, 
       sort_order, total_raised, avg_size, avg_subscription) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name || 'Unknown Banker', 
      category || 'Mainboard', 
      location || '', 
      sebi_registration || '', 
      website || '', 
      services || '', 
      parseInt(total_ipos) || 0, 
      parseInt(established_year) || null, 
      description || '', 
      logo_url || '', 
      is_active !== undefined ? is_active : 1, 
      parseInt(sort_order) || 0, 
      parseFloat(total_raised) || 0.00, 
      parseFloat(avg_size) || 0.00, 
      parseFloat(avg_subscription) || 0.00
    ];

    const [result] = await pool.query(query, values);
    
    // Set 'title' if schema expects it.
    try {
        await pool.query("UPDATE merchant_bankers SET title = ? WHERE id = ?", [name || 'Unknown Banker', result.insertId]);
    } catch(e) {}

    res.status(201).json({ id: result.insertId, message: "Mainboard banker created successfully" });
  } catch (error) {
    console.error("Error creating mainboard banker:", error);
    res.status(500).json({ error: "Failed to create banker" });
  }
});

// PUT update existing mainboard banker
router.put("/:id", async (req, res) => {
  try {
    const {
      name, title, category, location, sebi_registration, website, services,
      total_ipos, established_year, description, logo_url, is_active,
      sort_order, total_raised, avg_size, avg_subscription
    } = req.body;

    const query = `
      UPDATE merchant_bankers SET 
        name = ?, category = ?, location = ?, sebi_registration = ?, 
        website = ?, services = ?, total_ipos = ?, established_year = ?, 
        description = ?, logo_url = ?, is_active = ?, sort_order = ?, 
        total_raised = ?, avg_size = ?, avg_subscription = ?
      WHERE id = ?
    `;

    const useName = name || title || 'Unknown Banker'; // Fallback mapping

    const values = [
      useName,
      category || 'Mainboard',
      location || '',
      sebi_registration || '',
      website || '',
      services || '',
      parseInt(total_ipos) || 0,
      parseInt(established_year) || null,
      description || '',
      logo_url || '',
      is_active !== undefined ? is_active : 1,
      parseInt(sort_order) || 0,
      parseFloat(total_raised) || 0.00,
      parseFloat(avg_size) || 0.00,
      parseFloat(avg_subscription) || 0.00,
      req.params.id
    ];

    const [result] = await pool.query(query, values);
    
    try {
        await pool.query("UPDATE merchant_bankers SET title = ? WHERE id = ?", [useName, req.params.id]);
    } catch(e) {}

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Banker not found" });
    }
    
    res.json({ message: "Mainboard banker updated successfully" });
  } catch (error) {
    console.error("Error updating mainboard banker:", error);
    res.status(500).json({ error: "Failed to update banker" });
  }
});

// DELETE mainboard banker
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM merchant_bankers WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Banker not found" });
    }
    res.json({ message: "Mainboard banker deleted successfully" });
  } catch (error) {
    console.error("Error deleting mainboard banker:", error);
    res.status(500).json({ error: "Failed to delete banker" });
  }
});

export default router;
