import Card from "../models/Card.js";

export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find()
      .populate("user_id", "name email isBusiness")
      .sort({ createdAt: -1 });

    res.json(cards);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cards",
      error: error.message,
    });
  }
};

export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).populate(
      "user_id",
      "name email isBusiness"
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get card",
      error: error.message,
    });
  }
};

export const getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({
      user_id: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(cards);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get my cards",
      error: error.message,
    });
  }
};

export const createCard = async (req, res) => {
  try {
    const card = await Card.create({
      ...req.body,
      user_id: req.user._id,
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create card",
      error: error.message,
    });
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const isOwner = card.user_id.toString() === req.user._id.toString();

    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this card",
      });
    }

    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update card",
      error: error.message,
    });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const isOwner = card.user_id.toString() === req.user._id.toString();

    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this card",
      });
    }

    await card.deleteOne();

    res.json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete card",
      error: error.message,
    });
  }
};

export const likeCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = card.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      card.likes = card.likes.filter((id) => id.toString() !== userId);
    } else {
      card.likes.push(req.user._id);
    }

    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to like card",
      error: error.message,
    });
  }
};