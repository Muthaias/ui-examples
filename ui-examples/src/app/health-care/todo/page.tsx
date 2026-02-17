"use client"

import { ColumnSpec, DataSpec, Table } from "@/components/Table";
import React from "react";
import { useData } from "../contexts";
import { Pagination, usePagination } from "@/components/Pagination";
import Link from "next/link";
import { Activity } from "../common";
import { toLocalTime } from "../utils";

type ActivityTable = DataSpec<Activity>;

export default function Todo() {
  const {activities, users} = useData();
  const plannedActivities = activities.all().filter(a => a.schedule && a.status !== "done").sort((a, b) => a.schedule!.time.getTime() - b.schedule!.time.getTime()).map<ActivityTable>(a => {
    const recipient = users.get(a.recipient);
    return {
      id: a.id,
      title: <Link href={`entry/?entryId=${a.id}`}>{a.title}</Link>,
      status: a.status,
      priority: <span className={`badge text-bg-${a.priority}`}>{a.priority}</span>,
      recipient: <Link href={`/health-care/care-recipients/entry/?entryId=${recipient.username}`}>{recipient.username}</Link>,
      schedule: toLocalTime(a.schedule!.time),
    }
  });
  const unplannedActivities = activities.all().filter(a => !a.schedule && a.status !== "done").map<ActivityTable>(a => {
    const recipient = users.get(a.recipient);
    return {
      id: a.id,
      title: <Link href={`entry/?entryId=${a.id}`}>{a.title}</Link>,
      status: a.status,
      priority: <span className={`badge text-bg-${a.priority}`}>{a.priority}</span>,
      recipient: <Link href={`/health-care/care-recipients/entry/?entryId=${recipient.username}`}>{recipient.username}</Link>,
    }
  });
  const activityColumns: ColumnSpec<ActivityTable> = {
    title: "Titel",
    status: "Status",
    recipient: "Vårdtagare",
    priority: "Prioritet"
  };
  const plannedActivityColumns: ColumnSpec<ActivityTable> = {
    ...activityColumns,
    schedule: "Datum"
  }

  const plannedPagination = usePagination(plannedActivities)
  const unplannedPagination = usePagination(unplannedActivities)
  return (
    <>
      <h2>Att-göra-lista</h2>
      <h3>Icke schemalagt</h3>
      <Pagination pages={unplannedPagination.pages} currentPage={unplannedPagination.currentPage}/>
      <Table items={unplannedPagination.items} columns={activityColumns} />
      <Pagination pages={unplannedPagination.pages} currentPage={unplannedPagination.currentPage}/>

      <h3>Schemalagt</h3>
      <Pagination pages={plannedPagination.pages} currentPage={plannedPagination.currentPage}/>
      <Table items={plannedPagination.items} columns={plannedActivityColumns} />
      <Pagination pages={plannedPagination.pages} currentPage={plannedPagination.currentPage}/>
    </>
  )
}
