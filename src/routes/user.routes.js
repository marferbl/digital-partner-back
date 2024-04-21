const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("./../middleware/jwt.middleware");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("../cloudinary-config");
const Corporate = require("../models/corporate");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get("/", async (req, res) => {
  const userList = await User.find();
  res.sendStatus(200).send(userList);
});

router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  if (password.length < 2) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      const { email, _id, name, avatar } = createdUser;

      const user = { email, _id, name, avatar };

      res.status(201).json({ user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }
      console.log(email, foundUser)
      if (bcrypt.compareSync(password, foundUser.password)) {
        const { _id, email, name, avatar } = foundUser;

        const payload = { _id, email, name, avatar };

        const token = jwt.sign(payload, "secretToken", {
          algorithm: "HS256",
          expiresIn: "30d",
        });

        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: "Password or email are incorrect" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.put("/update", isAuthenticated, async (req, res) => {
  const userId = req.payload._id || req.payload.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

const upload = multer({ dest: "uploads/" });
router.post(
  "/change/avatar",
  upload.single("avatar"),
  isAuthenticated,
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const user = await User.findByIdAndUpdate(
        req.payload._id,
        {
          avatar: result.secure_url,
        },
        { new: true }
      );
      console.log(result, user);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

router.delete("/delete", async (req, res) => {
  let users = await User.find();
  console.log(users);
  users.map(async (elm) => {
    await User.findByIdAndRemove(elm.id);
  });
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.payload._id });
    const corporate = await Corporate.findOne({ superadmin: user.id });
    res.status(200).send(user);
  } catch (error) {
    res.status(500 || 400).send({ message: 'Something went wrong', error });
    return { success: false, error };
  }
});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
