import events from "./events.json";

export interface IEvent {
    name: string
    eventCategoryId: string
    url: string
    startUTC: Date
    endUTC: Date
}

export const Events: IEvent[] = events.map((event) => ({
    ...event,
    startUTC: new Date(event.startUTC),
    endUTC: new Date(event.endUTC)
}));
