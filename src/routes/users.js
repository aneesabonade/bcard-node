const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const config = require("../config/config");
const { auth, requireAdmin } = require("../middlewares/auth");
const { registerSchema, loginSchema, updateUserSchema } = require("../validations/userValidation");

const router = express.Router();

// POST /users (register) - all :contentReference[oaicite:6]{index=6}
router.post("/", async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(value.password, 10);
    const user = await User.create({ ...value, password: hashed });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isBusiness: user.isBusiness,
      isAdmin: user.isAdmin,
    });
  } catch (e) {
    next(e);
  }
});

// POST /users/login - all :contentReference[oaicite:7]{index=7}
router.post("/login", async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(value.password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // payload must include _id, isBusiness, isAdmin :contentReference[oaicite:8]{index=8}
    const token = jwt.sign(
      { _id: user._id.toString(), isBusiness: user.isBusiness, isAdmin: user.isAdmin },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (e) {
    next(e);
  }
});

// GET /users - admin :contentReference[oaicite:9]{index=9}
router.get("/", auth, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// GET /users/:id - registered user or admin :contentReference[oaicite:10]{index=10}
router.get("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.isAdmin && req.user._id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id, { password: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (e) {
    next(e);
  }
});

// PUT /users/:id - registered user :contentReference[oaicite:11]{index=11}
router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id !== id) return res.status(403).json({ message: "Forbidden" });

    const { error, value } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.email) {
      const exists = await User.findOne({ email: value.email, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: "Email already exists" });
    }

    if (value.password) value.password = await bcrypt.hash(value.password, 10);

    const updated = await User.findByIdAndUpdate(id, value, { new: true, projection: { password: 0 } });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// PATCH /users/:id - change isBusiness - registered user :contentReference[oaicite:12]{index=12}
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id !== id) return res.status(403).json({ message: "Forbidden" });

    const { isBusiness } = req.body;
    if (typeof isBusiness !== "boolean") {
      return res.status(400).json({ message: "isBusiness must be boolean" });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { isBusiness },
      { new: true, projection: { password: 0 } }
    );

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /users/:id - registered user or admin :contentReference[oaicite:13]{index=13}
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user.isAdmin && req.user._id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await User.findByIdAndDelete(id, { projection: { password: 0 } });
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted", _id: deleted._id });
  } catch (e) {
    next(e);
  }
});

module.exports = router;