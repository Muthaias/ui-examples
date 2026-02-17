"use client"

import { ColumnSpec, Table } from "@/components/Table";
import Link from "next/link";
import React from "react";
import { useData } from "../contexts";

type UserEntry = {
  id: string;
  username: React.ReactNode;
  name: string;
  roles: React.ReactNode;
}

export default function CareRecipients() {
  const {users, people} = useData();

  const recipients = users.all().filter(user => user.roles.some(r => r.type === "care-recipient")).map<UserEntry>(user => {
    const person = people.get(user.person);
    return {
      id: user.id,
      username: <Link href={`entry/?entryId=${user.username}`}>{user.username}</Link>,
      name: person.fullName,
      roles: user.roles.map(r => r.type).join(", ")
    }
  })

  const userColumns: ColumnSpec<UserEntry> = {
    username: "Vårdtagare",
    name: "Namn",
    roles: "Roller"
  };
  return (
    <>
      <h2>Vårdtagare</h2>
      <Table items={recipients} columns={userColumns} />
    </>
  )
}
