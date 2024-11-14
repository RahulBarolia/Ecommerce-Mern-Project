import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import addressRoute from "./routes/address.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import selectedAddressRoute from "./routes/SelectedAddressRoute.js";
import paymentRoute from "./routes/payment.route.js";
import orderRoute from "./routes/orders.route.js";
import path from "path";
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/address", addressRoute);
app.use("/api/selectedAddress", selectedAddressRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/orders", orderRoute);

if (process.env.NODE_ENV.trim() === "production") {
  const frontendPath = path.join(process.cwd(), "frontend", "dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port 5000");
});
