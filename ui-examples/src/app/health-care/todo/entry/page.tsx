"use client"
import { useSearchParams, notFound } from "next/navigation";
import { Suspense } from "react";
import React from "react";
import { useData } from "../../contexts";
import { ColumnSpec, DataSpec, VerticalTable } from "@/components/Table";
import { Activity } from "../../common";
import Link from "next/link";
import { toLocalTime } from "../../utils";



function EntryViewBase() {
  const searchParams = useSearchParams();
  const {activities, users, people} = useData();
  const activityId = searchParams.get("entryId")
  
  if (!activityId) notFound();
  const activity = activities.get({type: "activity", id: activityId});
  if (!activity) notFound();

  const creator = users.get(activity.createdBy);
  const recipient = users.get(activity.recipient);
  const activityColumns: ColumnSpec<Activity & {time: string}> = {
    title: "Titel",
    time: "Tidpunkt",
    content: "Beskrivning",
    recipient: "Vårdtagare",
    priority: "Prioritet",
    status: "Status",
    createdBy: "Skapare",
  }
  const activityView: DataSpec<Activity & {time: string}> = {
    id: activity.id,
    title: activity.title,
    time: activity.schedule ? toLocalTime(activity.schedule.time) : "-",
    content: activity.content,
    recipient: <Link href={`/health-care/care-recipients/entry/?entryId=${recipient.username}`}>{recipient.username}</Link>,
    priority: <span className={`badge text-bg-${activity.priority}`}>{activity.priority}</span>,
    status: activity.status,
    createdBy: creator.username,
  }
  return (
    <>
      <h2>Aktivitet {activity.schedule ? `planerad till ${toLocalTime(activity.schedule.time)}` : "(Icke schemalagd)"}</h2>
      <h3>Detaljer</h3>
      <VerticalTable items={[activityView]} columns={activityColumns} param="Param"/>
    </>
  )
}

export default function EntryView() {
  return (
    <Suspense fallback={<span />}>
      <EntryViewBase />
    </Suspense>
  )
}
