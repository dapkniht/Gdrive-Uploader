import { Queue } from "bullmq";
import redisConnection from "../../config/redis";

const uploadQueue = new Queue("upload", { connection: redisConnection });

export default uploadQueue;
