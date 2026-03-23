import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all IPOs with search, filter and pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const upcoming = req.query.upcoming || "";
    const status = req.query.status || "";

    let countQuery = "SELECT COUNT(*) as total FROM ipo_lists i";
    let dataQuery = `
      SELECT i.*, s.name AS sector_name, 
             b.image AS blog_image,
             COALESCE(NULLIF(b.new_slug, ''), b.slug) as blog_slug
      FROM ipo_lists i 
      LEFT JOIN sectors s ON i.sector_id = s.id
      LEFT JOIN admin_blogs b ON i.admin_blog_id = b.id
    `;
    const queryParams = [];
    const whereClauses = [];

    if (search) {
      whereClauses.push("(i.issuer_company LIKE ? OR i.merchant_bankers LIKE ? OR i.exchange LIKE ?)");
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (category) {
      whereClauses.push("i.issue_category = ?");
      queryParams.push(category);
    }

    if (upcoming) {
      whereClauses.push("i.upcoming = ?");
      queryParams.push(upcoming);
    }

    if (status) {
      whereClauses.push("i.status = ?");
      queryParams.push(status);
    }

    if (whereClauses.length > 0) {
      const whereString = " WHERE " + whereClauses.join(" AND ");
      countQuery += whereString;
      dataQuery += whereString;
    }

    const sortField = req.query.sort || "id";
    const allowedSortFields = ["id", "issuer_company", "sector_name", "listing_date", "gmp"];
    const finalSortField = allowedSortFields.includes(sortField) ? sortField : "id";
    const sortFieldSql = finalSortField === "sector_name" ? "s.name" : (finalSortField === "id" ? "i.id" : finalSortField);
    
    dataQuery += ` ORDER BY ${sortFieldSql} DESC LIMIT ? OFFSET ?`;
    const dataParams = [...queryParams, limit, offset];

    const [[{ total }]] = await pool.query(countQuery, queryParams);
    const [data] = await pool.query(dataQuery, dataParams);

    // Map nulls (only for numeric indicators, keep paths/slugs as null or empty)
    const processedData = data.map(item => {
      const processed = { ...item };
      const excludeFromZero = ['logo', 'blog_image', 'blog_slug', 'sector_name', 'issuer_company', 'status', 'issue_category', 'date_declared', 'open_date', 'close_date', 'listing_date', 'merchant_bankers', 'exchange'];
      
      Object.keys(processed).forEach(key => {
        if (processed[key] === null && !excludeFromZero.includes(key)) {
          processed[key] = 0;
        }
      });
      return processed;
    });

    res.json({
      data: processedData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching IPO lists:", error);
    res.status(500).json({ error: "Failed to fetch IPO lists" });
  }
});

// GET sectors (for dropdown in admin)
router.get("/sectors/list", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, name AS sector_name FROM sectors ORDER BY name ASC");
        res.json(rows);
    } catch(e) {
        res.status(500).json({ error: "Failed to fetch sectors" });
    }
});

// GET single IPO by ID
router.get("/:id", async (req, res) => {
  try {
    const [data] = await pool.query("SELECT * FROM ipo_lists WHERE id = ?", [req.params.id]);
    if (data.length === 0) {
      return res.status(404).json({ error: "IPO not found" });
    }
    
    const item = data[0];
    Object.keys(item).forEach(key => {
      if (item[key] === null) item[key] = 0;
    });

    res.json(item);
  } catch (error) {
    console.error("Error fetching single IPO:", error);
    res.status(500).json({ error: "Failed to fetch IPO" });
  }
});

// POST new IPO
router.post("/", async (req, res) => {
  try {
    const fields = [
      'logo', 'issuer_company', 'date_declared', 'open_date', 'close_date', 
      'listing_date', 'merchant_bankers', 'issue_lowest_price', 'issue_highest_price', 
      'issue_size', 'lot_size', 'exchange', 'gmp', 'issue_category', 'sector_id', 
      'merchant_banker', 'current_price', 'ipo_pe_ratio', 'listing_day_close_bse', 
      'listing_day_close_nse', 'status', 'upcoming', 'confidential', 'upcoming_ipo_status', 'admin_blog_id'
    ];

    const values = fields.map(field => req.body[field] === undefined ? null : req.body[field]);
    const placeholders = fields.map(() => '?').join(', ');
    const query = `INSERT INTO ipo_lists (${fields.join(', ')}) VALUES (${placeholders})`;

    const [result] = await pool.query(query, values);
    res.status(201).json({ id: result.insertId, message: "IPO created successfully" });
  } catch (error) {
    console.error("Error creating IPO:", error);
    res.status(500).json({ error: "Failed to create IPO" });
  }
});

// PUT update existing IPO
router.put("/:id", async (req, res) => {
  try {
    const fields = [
      'logo', 'issuer_company', 'date_declared', 'open_date', 'close_date', 
      'listing_date', 'merchant_bankers', 'issue_lowest_price', 'issue_highest_price', 
      'issue_size', 'lot_size', 'exchange', 'gmp', 'issue_category', 'sector_id', 
      'merchant_banker', 'current_price', 'ipo_pe_ratio', 'listing_day_close_bse', 
      'listing_day_close_nse', 'status', 'upcoming', 'confidential', 'upcoming_ipo_status', 'admin_blog_id'
    ];

    const updates = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => req.body[field] === undefined ? null : req.body[field]);
    values.push(req.params.id);

    const query = `UPDATE ipo_lists SET ${updates} WHERE id = ?`;

    const [result] = await pool.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "IPO not found" });
    }
    res.json({ message: "IPO updated successfully" });
  } catch (error) {
    console.error("Error updating IPO:", error);
    res.status(500).json({ error: "Failed to update IPO" });
  }
});

// DELETE IPO
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM ipo_lists WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "IPO not found" });
    }
    res.json({ message: "IPO deleted successfully" });
  } catch (error) {
    console.error("Error deleting IPO:", error);
    res.status(500).json({ error: "Failed to delete IPO" });
  }
});

export default router;
