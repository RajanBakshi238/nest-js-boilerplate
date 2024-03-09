import { registerAs } from "@nestjs/config";

export default registerAs(
    'database',
    (): Record<string, any> => ({
        host: process.env?.DATABASE_HOST ?? '',
        name: process.env?.DATABASE_NAME ?? '',
        password: process.env?.DATABASE_PASSWORD,
        options: process.env?.DATABASE_OPTIONS,
        timeoutOptions: {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 10000,
            heartbeatFrequencyMS: 30000,
        },
    })
);