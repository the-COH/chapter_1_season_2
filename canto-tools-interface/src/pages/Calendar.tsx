import React, {useEffect, useState} from "react";
import {Events, IEvent} from "../data/Events";
import {EventCategories, IEventCategory} from "../data/EventCategories";
import Moment from "react-moment";
import moment from "moment";
import Layout from "../Layout";

const eventCategoryIds = Object.values(EventCategories)
    .sort((a: IEventCategory, b: IEventCategory) => b.name.localeCompare(a.name))
    .map(eventCategory => eventCategory.id);

const events = Events;

export default function Calendar(): JSX.Element {
    const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
    const [visibleEvents, setVisibleEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        setVisibleEvents(
            events
                .filter((event: IEvent) => selectedEventTypes.length === 0 ? true : selectedEventTypes.includes(event.eventCategoryId))
        );
    }, [selectedEventTypes]);

    return (
        <Layout>
            <>
                <header className="hero py-2 pb-4">
                    <h1 className={"m-0"}>
                        📅 Calendar
                    </h1>
                    <p className="ms-3 text-muted lead mt-3">
                        Here you will be able to find and filter upcoming events from the Canto ecosystem.
                    </p>
                </header>
                <ul className="list-inline text-center mb-5">
                    {eventCategoryIds
                        .map(eventCategoryId => (
                            <li
                                key={eventCategoryId}
                                className={"list-inline-item"}
                            >
                                <button
                                    type={"button"}
                                    onClick={() => setSelectedEventTypes(selectedEventTypes.includes(eventCategoryId) ? [] : [eventCategoryId])}
                                    className={"btn btn-dark"}
                                >
                                    {selectedEventTypes.includes(eventCategoryId) && "✅"}{" "}
                                    {EventCategories[eventCategoryId].name}
                                </button>
                            </li>
                        ))}
                </ul>
                <div className="card">
                    {visibleEvents.length > 0 ? (
                        <table className="table m-0">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Ends At</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {visibleEvents
                                    .map((event: IEvent, index: number) => (
                                        <tr key={(event.name+index.toString(10))}>
                                            <td>
                                                <p className={"event-name m-0 text-white"}>
                                                    {event.name}
                                                </p>
                                                <a href={event.url} target={"_blank"} rel="noreferrer" className={"text-muted small"}>
                                                    View
                                                    <small>
                                                        <sup>
                                                            <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                                        </sup>
                                                    </small>
                                                </a>
                                            </td>
                                            <td>
                                                {EventCategories[event.eventCategoryId]?.name || "Unknown"}
                                            </td>
                                            <td>
                                                <Moment date={event.startUTC} format="HH:mm - MMM DD, YYYY" />
                                            </td>
                                            <td>
                                                <Moment date={event.endUTC} format="HH:mm - MMM DD, YYYY" />
                                            </td>
                                            <td className={"text-end"}>
                                                <a
                                                    href={"https://calendar.google.com/calendar/render?action=TEMPLATE&dates="+(moment(event.startUTC).format("YYYYMMDDTHHmmss")+"Z")+"%2F"+(moment(event.endUTC).format("YYYYMMDDTHHmmss")+"Z")+"&location="+encodeURIComponent(event.url)+"&text="+encodeURIComponent(event.name)}
                                                    target={"_blank"}
                                                    rel={"noreferrer"}
                                                    className={"btn btn-dark btn-sm"}
                                                >📅 Save</a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={"card-body text-center text-muted"}>
                            No events found.
                        </div>
                    )}
                </div>
            </>
        </Layout>
    );
}
