# Add Event to the Calendar

## 1. Fork this repository

## 2. Add your event

Modify `src/data/events.json`, and add your event. Make sure it adhere to the following interface:

```typescript
interface Event {
    name: string
    eventCategoryId: string
    url: string
    startUTC: Date
    endUTC: Date
}
```

## 3. Open a PR

Open a PR to this repository, and we will add the event as soon as the PR has been validated.
