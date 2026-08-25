import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.atoken;

    console.log("Received Token:", token);

    if (!token) {
      return res.json({
        success: false,
        message: "Token Missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded Token:", decoded);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authAdmin;