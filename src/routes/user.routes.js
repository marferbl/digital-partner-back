const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("./../middleware/jwt.middleware");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("../cloudinary-config");
const Corporate = require("../models/corporate");
const favorite = require("../models/favorite");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");


router.get("/", async (req, res) => {
  const userList = await User.find();
  res.sendStatus(200).send(userList);
});

router.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if email, password, or name are empty
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Provide email, password, and name" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Provide a valid email address." });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  try {
    // Check if a user with the same email already exists
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Encrypt password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new user
    const createdUser = await User.create({ email, password: hashedPassword, name });

    // Create a favorite for the user
    await favorite.create({ userId: createdUser._id });

    // Prepare user object for response
    const { _id, avatar } = createdUser;
    const user = { email, _id, name, avatar };



    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    // });

    // const mailConfigurations = {
    //   from: {
    //     name: 'Digitalando Team',
    //     address: 'digitalandocompany@gmail.com'
    //   },
    //   to: email,
    //   subject: 'Email Verification',
    //   html: `
    //     <div>
    //       <b>Haz click en el siguiente enlace para confirmar tu cuenta</b><br><br>
    //       <a href='http://localhost:3000/confirm/email/${_id}'>Confirmar</a>
    //     </div>
    //   `
    // };

    // transporter.sendMail(mailConfigurations, function (error, info) {
    //   if (error) throw Error(error);
    //   else {
    //     console.log('Email Sent Successfully');
    //     console.log(info);
    //   }

    // });


    // Respond with the created user data
    res.status(201).json({ user });
  } catch (err) {
    console.error(err); // Log error for debugging purposes
    res.status(500).json({ message: "Internal Server Error" });
  }
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

const upload = multer({ dest: "/tmp" });
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
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.delete("/delete", async (req, res) => {
  let users = await User.find();
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
    const corporate = await Corporate.findOne({ superadmin: req.payload._id });
    const userResponse = user.toObject();
    if (corporate) {
      userResponse.corporate = corporate;
    }

    res.status(200).send(userResponse);
  } catch (error) {
    res.status(500 || 400).send({ message: 'Something went wrong', error });
    return { success: false, error };
  }
});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 300000,
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/change-password', isAuthenticated, async (req, res) => {
  const { password } = req.body;
  const user = await User.findOne({ _id: req.payload._id });
  const email = user.email
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const user
      = await User.findOneAndUpdate
        ({ email }, { password: hashedPassword }, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }

});

router.put('/verify-email', async (req, res) => {
  const id = req.body.id
  try {
    const user
      = await User.findByIdAndUpdate
        ({ id }, { verified: true }, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }

});

router.post('/send-new-password', async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email });
  const id = user._id
  const newPass = id.toString()

  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(newPass, salt);

    const user
      = await User.findByIdAndUpdate
        (id, { password: hashedPassword }, { new: true });


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailConfigurations = {
      from: {
        name: 'Digitalando Team',
        address: 'digitalandocompany@gmail.com'
      },
      to: email,
      subject: 'Cambio de contraseña',
      html: `
        <div>
          <b>Aqui tienes tu nueva contraseña, accede al panel para poner la contraseña que tu quieras</b><br><br>
          <p>${newPass}</p>
        </div>
      `
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) throw Error(error);
      else {
        console.log('Email Sent Successfully');
      }

    });

    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }

});


module.exports = router;
