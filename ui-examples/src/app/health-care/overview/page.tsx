"use client"

import { Log, Notification } from "@/app/health-care/common";
import { ColumnSpec, Table } from "@/components/Table";
import { NavItem, useNav } from "@/contexts";
import Link from "next/link";
import React from "react";
import { useData } from "../contexts";
import { toLocalTime } from "../utils";

type EntryPoint = {
  id: string;
  name: string;
  href: React.ReactNode;
}

type LogEntry = {
  id: string;
  content: React.ReactNode;
  createdAt: string;
}

type NotificationEntry = {
  id: string;
  content: React.ReactNode,
  priority: Notification["priority"]
}

export default function Overview() {
  const navItems = useNav();
  const {notifications, logs, users, people} = useData();
  const entryPoints: EntryPoint[] = navItems.filter((item): item is NavItem => item.type === "item").filter(item => item.tags && item.tags.includes("overview")).map(item => ({
    id: item.id,
    name: item.label,
    href: <Link href={item.href}>{item.label}</Link>
  }));
  const entryPointColumns: ColumnSpec<EntryPoint> = {
    name: "Systemfunktioner",
    href: "Gå dit",
  };

  const notificationList = notifications.all().map<NotificationEntry>(n => ({
    id: n.id,
    priority: n.priority,
    content: <div>{n.content}</div>
  }));
  const notificationColumns: ColumnSpec<Notification> = {
    priority: "Prioritering",
    content: "Meddelande"
  };

  const logList: LogEntry[] = logs.find({limit: 3, orderBy: "createdAt"}).map<LogEntry>(l => {
    const user = users.get(l.createdBy);
    const person = people.get(user.person)
    return {
      id: l.id,
      content: <div className="readable-text">{l.content}</div>,
      createdAt: toLocalTime(l.createdAt),
      createdBy: person.fullName
    }
  });
  const logColumns: ColumnSpec<Log> = {
    content: "Händelse",
    createdAt: "Tidpunkt",
    createdBy: "Skapare"
  };
  return (
    <>
      <h2>Översikt</h2>
      <div className="row g-5">
        <div className="col col-12 col-md-6">
          <h3>Hantera</h3>
          <Table items={entryPoints} columns={entryPointColumns} />
        </div>

        <div className="col col-12 col-md-6">
          <h3>Notifieringar</h3>
          <Table items={notificationList} columns={notificationColumns} />
        </div>

        <div className="col col-12">
          <h3>Händelser</h3>
          <Table items={logList} columns={logColumns} />
        </div>
      </div>
    </>
  )
}
