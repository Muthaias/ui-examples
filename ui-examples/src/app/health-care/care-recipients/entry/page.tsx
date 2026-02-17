"use client"
import { useSearchParams, notFound } from "next/navigation";
import { Suspense } from "react";
import React from "react";
import { useData } from "../../contexts";
import { ColumnSpec, Table, VerticalTable } from "@/components/Table";
import { Person } from "../../common";
import { toLocalDate } from "../../utils";

type MedicationEntry = {
  id: string,
  usage: string,
  name: React.ReactNode,
  period: React.ReactNode,
  dosage: React.ReactNode
}

function EntryViewBase() {
  const searchParams = useSearchParams();
  const {users, people} = useData();
  const userId = searchParams.get("entryId")
  const user = users.all().filter(user => user.username === userId)[0]
  if (!userId || !user) {
    notFound();
  }
  const person = people.get(user.person);
  const personColumns: ColumnSpec<Person> = {
    name: "Namn",
    fullName: "Komplett namn",
    notes: "Anteckningar"
  }
  const medicationList = (person.medication || []).map<MedicationEntry>(m => ({
    id: m.name,
    name: m.name,
    usage: m.usage,
    period: `${toLocalDate(m.period.startsAt)} - ${toLocalDate(m.period.endsAt)}`,
    dosage: m.dosage
  }))
  const medicationColumns: ColumnSpec<MedicationEntry> = {
    name: "Namn",
    usage: "Brukas mot",
    period: "Period",
    dosage: "Dos"
  }
  return (
    <>
      <h2>Vårdtagare {person.fullName}</h2>
      <h3>Egenskaper</h3>
      <VerticalTable items={[person]} columns={personColumns} param="Param"/>

      <h3>Medicin</h3>
      <Table items={medicationList} columns={medicationColumns}/>
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
