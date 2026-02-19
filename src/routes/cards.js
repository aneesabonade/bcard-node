const express = require("express");
const Card = require("../models/Card");
const { auth, requireBusiness } = require("../middlewares/auth");
const { cardSchema } = require("../validations/cardValidation");

const router = express.Router();

function randomBizNumber() {
  return Math.floor(1000000 + Math.random() * 9000000);
}

// GET /cards - all :contentReference[oaicite:14]{index=14}
router.get("/", async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (e) {
    next(e);
  }
});

// GET /cards/my-cards - registered user :contentReference[oaicite:15]{index=15}
router.get("/my-cards", auth, async (req, res, next) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.json(cards);
  } catch (e) {
    next(e);
  }
});

// GET /cards/:id - all :contentReference[oaicite:16]{index=16}
router.get("/:id", async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  } catch (e) {
    next(e);
  }
});

// POST /cards - Business user :contentReference[oaicite:17]{index=17}
router.post("/", auth, requireBusiness, async (req, res, next) => {
  try {
    const { error, value } = cardSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // unique bizNumber
    let bizNumber = randomBizNumber();
    while (await Card.exists({ bizNumber })) bizNumber = randomBizNumber();

    const card = await Card.create({
      ...value,
      bizNumber,
      user_id: req.user._id,
      likes: [],
    });

    res.status(201).json(card);
  } catch (e) {
    next(e);
  }
});

// PUT /cards/:id - only owner :contentReference[oaicite:18]{index=18}
router.put("/:id", auth, async (req, res, next) => {
  try {
    const { error, value } = cardSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    if (card.user_id.toString() !== req.user._id) {
      return res.status(403).json({ message: "Only owner can edit" });
    }

    Object.assign(card, value);
    await card.save();

    res.json(card);
  } catch (e) {
    next(e);
  }
});

// PATCH /cards/:id - like card - registered user :contentReference[oaicite:19]{index=19}
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const userId = req.user._id;
    const idx = card.likes.findIndex((x) => x.toString() === userId);

    if (idx >= 0) {
      card.likes.splice(idx, 1); // unlike
    } else {
      card.likes.push(userId); // like
    }

    await card.save();
    res.json(card);
  } catch (e) {
    next(e);
  }
});

// DELETE /cards/:id - owner or admin :contentReference[oaicite:20]{index=20}
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const isOwner = card.user_id.toString() === req.user._id;
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Owner or admin only" });
    }

    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: "Card deleted", _id: req.params.id });
  } catch (e) {
    next(e);
  }
});

module.exports = router;