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

    let countQuery = "SELECT COUNT(*) as total FROM marchantbankers WHERE mcat_id = 'list-of-mainboard-merchant-bankers'";
    let dataQuery = "SELECT * FROM marchantbankers WHERE mcat_id = 'list-of-mainboard-merchant-bankers'";
    const queryParams = [];

    if (search) {
      // Searching in title, description, slug which exist in marchantbankers
      const searchClause = " AND (title LIKE ? OR description LIKE ? OR slug LIKE ?)";
      countQuery += searchClause;
      dataQuery += searchClause;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    dataQuery += " ORDER BY id DESC LIMIT ? OFFSET ?";
    const dataParams = [...queryParams, limit, offset];

    const [countResult] = await pool.query(countQuery, queryParams);
    const total = countResult[0]?.total || 0;
    
    const [data] = await pool.query(dataQuery, dataParams);

    // Map marchantbankers columns to frontend expectations
    const mappedData = data.map(row => ({
      ...row,
      name: row.title || "Unknown Banker",
      logo_url: row.image ? (row.image.startsWith('/') ? row.image : '/' + row.image) : null,
      total_ipos: row.noOfiposofar || 0,
      total_raised: row.totalfundraised || 0,
      avg_size: row.avgiposize || 0,
      avg_subscription: row.avgsubscription || 0,
      website: row.cweblink || "",
      location: row.caddress || "",
      sebi_registration: row.slug || "", // slug might contain reg info or similar unique ID
      is_active: 1
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

// GET single mainboard banker by ID (full details)
router.get("/:id", async (req, res) => {
  try {
    const [data] = await pool.query(
      "SELECT * FROM marchantbankers WHERE id = ? AND mcat_id = 'list-of-mainboard-merchant-bankers'",
      [req.params.id]
    );
    if (data.length === 0) {
      // fallback: search without mcat filter
      const [fallback] = await pool.query("SELECT * FROM marchantbankers WHERE id = ?", [req.params.id]);
      if (fallback.length === 0) return res.status(404).json({ error: "Banker not found" });
      const r = fallback[0];
      return res.json({
        ...r,
        name: r.title || "Unknown Banker",
        logo_url: r.image ? (r.image.startsWith('/') ? r.image : '/' + r.image) : null,
      });
    }
    const r = data[0];
    res.json({
      ...r,
      name: r.title || "Unknown Banker",
      logo_url: r.image ? (r.image.startsWith('/') ? r.image : '/' + r.image) : null,
      total_ipos: r.noOfiposofar || 0,
      total_raised: r.totalfundraised || 0,
      avg_size: r.avgiposize || 0,
      avg_subscription: r.avgsubscription || 0,
      avg_listing_gain: r.avglisting_gain || 0,
      website: r.cweblink || "",
      location: r.caddress || "",
    });
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
