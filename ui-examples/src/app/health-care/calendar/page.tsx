"use client"

import React, { Suspense, useState } from "react";
import dynamic from 'next/dynamic';
import { useData } from "../contexts";
import { Activity, User, UserRef } from "../common";
import { toLocalDate } from "../utils";

function getCalendarWeekDays(month: number, year: number = new Date().getFullYear()) {
  const monthStart = new Date(Date.UTC(year, month, 1));
  const monthEnd = new Date(Date.UTC(year, month + 1, 0));
  monthStart.setDate(monthStart.getDate() - (monthStart.getDay() + 6) % 7);
  monthEnd.setDate(monthEnd.getDate() + (7 - monthEnd.getDay()) % 7);
  const startTime = monthStart.getTime();
  const dayDelta = 3600 * 24 * 1000;
  const dayCount = Math.floor((monthEnd.getTime() - startTime) / dayDelta) + 1;
  return Array.from({length: dayCount}).map((_, index) => {
    return new Date(startTime + index * dayDelta);
  })
}

function dateStr(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}`
}

const monthMap = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dec"
];

const dayMap = [
  "Sön",
  "Mån",
  "Tis",
  "Ons",
  "Tor",
  "Fre",
  "Lör",
];

function CalendarDay({active, date, children}: {active: boolean, date: Date, children?: React.ReactNode}) {
  return (
    <div className={`card md-mx-2 ${active ? "" : "opacity-25"}`}>
      <div className="d-flex flex-column flex-sm-row">
        <span className="card-header flex-fill p-1 text-center">{dayMap[date.getDay()]}</span>
        <span className="card-header flex-fill p-1 text-center">{dateStr(date)}</span>
      </div>
      <div className="card-body p-0">{children}</div>
    </div>
  )
}

function ClientBaseCalendar({dates, month, selectMonth}: {dates: Date[], month: number, selectMonth: (m: number) => void}) {
  const { activities, users, people } = useData();
  const [ recipient, setRecipient ] = useState<UserRef | null>(null);
  const starts = dates[0];
  const ends = dates[dates.length - 1];
  const currentActivities = activities.all().filter(a => a.schedule && (a.schedule.time >= starts && a.schedule.time <= ends));
  const recipients = Object.values(currentActivities.reduce<Record<string, User>>((acc, a) => {
    const recipient = acc[a.recipient.id] || users.get(a.recipient);
    acc[recipient.id] = recipient;
    return acc;
  }, {})).sort((a, b) => a.username.localeCompare(b.username));
  const activityMap = currentActivities.filter(a => recipient === null || recipient.id === a.recipient.id).reduce<Record<string, Activity[]>>((acc, a) => {
    const key = toLocalDate(a.schedule!.time);
    const alist = acc[key] || [];
    acc[key] = [...alist, a];
    return acc;
  }, {})
  return (
    <>
      <h2>Kalender</h2>
      <div className="btn-group mb-2 overflow-auto" role="group">
        <span className="input-group-text">Välj vårdtagare</span>
        {recipients.map((r, m) => {
          const active = r.id === (recipient && recipient.id);
          const person = people.get(r.person)
          return (
            <button key={m} onClick={() => active ? setRecipient(null) : setRecipient(r)} className={`btn btn-info ${active ? "active" : ""}`}>{person.fullName}</button>
          )
        })}
      </div>
      <div className="btn-group-vertical mb-2 d-flex d-md-none" role="group">
      {Array.from({length: 12}).map((_, m) => (
        <button key={m} onClick={() => selectMonth(m)} className={`btn btn-secondary ${month === m ? "active" : ""}`}>{monthMap[m]}</button>
      ))}
      </div>
      <div className="btn-group mb-2 d-none d-md-flex overflow-auto" role="group">
      {Array.from({length: 12}).map((_, m) => (
        <button key={m} onClick={() => selectMonth(m)} className={`btn btn-secondary ${month === m ? "active" : ""}`}>{monthMap[m]}</button>
      ))}
      </div>
      <div style={{gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr"}} className="gap-2 d-none d-lg-grid">
      {dates.map(d => {
        const inMonth = d.getMonth() === month;
        const key = toLocalDate(d);
        const alist = activityMap[key] || [];
        return (
          <CalendarDay key={d.getTime()} active={inMonth} date={d}>
            <div style={{gridTemplateColumns: "1fr 1fr"}}  className="d-grid gap-2 p-2">
              {alist.map(a => <span key={a.id} className={`badge text-bg-${a.priority}`}>{a.status}</span>)}
            </div>
          </CalendarDay>
        )
      })}
      </div>
      <div style={{gridTemplateColumns: "1fr 1fr"}} className="gap-2 d-grid d-lg-none">
      {dates.filter(d => d.getMonth() === month).map(d => {
        const key = toLocalDate(d);
        const alist = activityMap[key] || [];
        return (
          <CalendarDay key={d.getTime()} active={true} date={d}>
            <div style={{gridTemplateColumns: "1fr 1fr"}}  className="d-grid gap-2 p-2">
              {alist.map(a => <span key={a.id} className={`badge text-bg-${a.priority}`}>{a.status}</span>)}
            </div>
          </CalendarDay>
        )
      })}
      </div>
    </>
  )
}

export const BaseCalendar = dynamic(() => Promise.resolve(ClientBaseCalendar), {
  ssr: false,
});

export function ConnectedCalendar() {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const dates = getCalendarWeekDays(month);
  return (
    <BaseCalendar dates={dates} month={month} selectMonth={setMonth}/>
  )
}

export default function Calendar() {

  return (
    <Suspense fallback={<></>}>
      <ConnectedCalendar />
    </Suspense>
  )
}