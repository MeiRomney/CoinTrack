export type EventPayload = {
    event: string;
    data: Record<string, any>;
    ttl?: number;
};
export declare function publishEvent(payload: EventPayload): Promise<any>;
//# sourceMappingURL=eventsPublisher.d.ts.map