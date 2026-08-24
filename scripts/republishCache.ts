import mongoose from "mongoose";
import { initDb } from "../src/config/db";
import { createMessageProducerBroker } from "../src/common/factories/brokerFactory";
import productModel from "../src/product/product-model";
import toppingModel from "../src/topping/topping-model";
import { mapToObject } from "../src/utils";
import { ProductEvents } from "../src/product/product-types";
import { ToppingEvents } from "../src/topping/topping-types";

const run = async () => {
    await initDb();
    console.log("Connected to catalog DB");

    const broker = createMessageProducerBroker();
    await broker.connect();
    console.log("Connected to Kafka producer");

    const products = await productModel.find();
    console.log(`Found ${products.length} products`);
    for (const p of products) {
        const message = JSON.stringify({
            event_type: ProductEvents.PRODUCT_CREATE,
            data: {
                id: String(p._id),
                priceConfiguration: mapToObject(
                    p.priceConfiguration as unknown as Map<string, unknown>,
                ),
            },
        });
        await broker.sendMessage("product", message);
    }
    console.log(`Published ${products.length} product events`);

    const toppings = await toppingModel.find();
    console.log(`Found ${toppings.length} toppings`);
    for (const t of toppings) {
        const message = JSON.stringify({
            event_type: ToppingEvents.TOPPING_CREATE,
            data: {
                id: String(t._id),
                price: t.price,
                tenantId: t.tenantId,
            },
        });
        await broker.sendMessage("topping", message);
    }
    console.log(`Published ${toppings.length} topping events`);

    await broker.disconnect();
    await mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
