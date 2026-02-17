"use client"

import { ColumnSpec, Table } from "@/components/Table";
import React from "react";
import { useData } from "../contexts";
import { Pagination, usePagination } from "@/components/Pagination";
import Link from "next/link";
import { toLocalDate } from "../utils";

type LogTable = {
  id: string;
  content: string;
  recipient: React.ReactNode;
  createdAt: string;
}

export default function Todo() {
  const { logs, users } = useData();
  const allLogs = logs.all().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map<LogTable>(l => {
    const recipient = users.get(l.recipient);
    return {
      id: l.id,
      content: l.content,
      recipient: <Link href={`/health-care/care-recipients/entry/?entryId=${recipient.username}`}>{recipient.username}</Link>,
      createdAt: toLocalDate(l.createdAt),
    }
  });
  const logColumns: ColumnSpec<LogTable> = {
    content: "Händelse",
    recipient: "Vårdtagare",
    createdAt: "Tidpunkt"
  };
  const pagination = usePagination(allLogs)
  return (
    <>
      <h2>Händelser</h2>
      <Pagination pages={pagination.pages} currentPage={pagination.currentPage} />
      <Table items={pagination.items} columns={logColumns} />
      <Pagination pages={pagination.pages} currentPage={pagination.currentPage} />
    </>
  )
}
