const jwt = require("jsonwebtoken");
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token yo'q" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Faqat admin kirishi mumkin" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token yaroqsiz yoki muddati o'tgan" });
  }
};
module.exports = verifyAdmin;