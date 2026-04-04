// backend/src/utils/eventsPublisher.ts
import axios from "axios";

const EVENTS_SERVER_URL = process.env.EVENTS_SERVER_URL;
const EVENTS_API_KEY = process.env.EVENTS_API_KEY;

export type EventPayload = {
  event: string;
  data: Record<string, any>;
  ttl?: number;
};

export async function publishEvent(payload: EventPayload) {
  if (!EVENTS_SERVER_URL || !EVENTS_API_KEY) {
    // In development, skip silently; in production, fail loudly
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Event Publish Skipped] EVENTS_SERVER_URL/EVENTS_API_KEY not configured",
        payload.event,
      );
      return null;
    }
    throw new Error(
      "EVENTS_SERVER_URL and EVENTS_API_KEY must be set in environment variables",
    );
  }
  try {
    const res = await axios.post(`${EVENTS_SERVER_URL}/publish`, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": EVENTS_API_KEY,
      },
      timeout: 5000,
    });
    console.log("[Event Published]", payload.event, payload.data, res.status);
    return res.data;
  } catch (err: any) {
    console.error("[Event Publish Error]", payload.event, err.message);
    throw err;
  }
}
