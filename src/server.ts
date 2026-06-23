import app from "./app";
import { initDb } from "./config/db";
import logger from "./config/logger";
import config from "config";
import { MessageProducerBroker } from "./common/types/broker";
import { createMessageProducerBroker } from "./common/factories/brokerFactory";

const startServer = async () => {
    const PORT = config.get("server.port") || 5503;
    let messageProducerbroker: MessageProducerBroker | null = null;
    try {
        await initDb();
        logger.info("Database connected successfully");

        // connect to kafka
        messageProducerbroker = createMessageProducerBroker();
        await messageProducerbroker.connect();

        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (messageProducerbroker) {
                await messageProducerbroker.disconnect();
            }
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

startServer();
