import eventCategories from "./event-categories.json";

export interface IEventCategory {
  id: string
  name: string
}

export const EventCategories: { [eventCategoryId: string]: IEventCategory } = eventCategories;
