import { seconds, ThrottlerOptions } from "@nestjs/throttler";

export const REGISTER_THROTTLER: ThrottlerOptions = {
    limit: 5,
    ttl: seconds(60)
}

export const LOGIN_THROTTLER: ThrottlerOptions = {
    limit: 5,
    ttl: seconds(60)
}