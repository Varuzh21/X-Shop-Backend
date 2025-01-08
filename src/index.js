import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRouter from "./routes/auth.router.js";
import ProductsRouter from "./routes/products.router.js";
import CategoryRouter from "./routes/category.router.js";
import CartRouter from "./routes/cart.router.js";
import CardRouter from "./routes/card.router.js";


const app = express();

dotenv.config()
app.use(cors("*"));

app.use(express.json());
app.use('/', AuthRouter);
app.use('/', ProductsRouter);
app.use('/', CategoryRouter);
app.use('/', CartRouter);
app.use('/', CardRouter);



app.listen(process.env.PORT, () => {
    console.log(`Server start at http://localhost:${process.env.PORT}`);
});
