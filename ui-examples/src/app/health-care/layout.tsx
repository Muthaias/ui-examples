"use client"
import { Suspense } from "react";
import { NavContext, NavItems } from "@/contexts";
import { Sidebar } from "@/components/Sidebar";
import { NavStateProvider } from "@/components/NavStateProvider";
import { DataContext, HealtCareData, StaticDataSource } from "./contexts";
import { Activity, Log, Notification, Person, User, UserRef } from "./common";
import { getGenerator } from "@/data/health-care";

const generator = getGenerator();
const dataset = generator.createData();

function toList<T extends Record<string, T[keyof T]>>(record: T): T[keyof T][] {
  return Object.keys(record).map((key) => record[key])
}

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: UserRef = toList(dataset.users).filter(u => u.roles.some(r => r.type === "care-recipient-relation"))[0];
  const data: HealtCareData = {
    notifications: new StaticDataSource<Notification>([
      "Det finns saker att göra",
      "Det finns saker att titta på",
      "Det finns saker att tänka på"
    ].map<Notification>((item, index) => ({
      type: "notification",
      id: `notification-${index}`,
      content: item,
      priority: "info",
      user,
    }))),
    logs: new StaticDataSource<Log>(toList(dataset.logs)),
    users: new StaticDataSource<User>(toList(dataset.users)),
    activities: new StaticDataSource<Activity>(toList(dataset.activities)),
    people: new StaticDataSource<Person>(toList(dataset.people)),
  }
  const navItems: NavItems =  [
    {type: "heading", label: "Anhörig"},
    {type: "item", label: "Översikt", href: "/health-care/overview", id: "overview"},
    {type: "item", label: "Vårdtagare", href: "/health-care/care-recipients", id: "care-recipients", tags: ["overview"]},
    {type: "item", label: "Logg", href: "/health-care/log", id: "log"},
    {type: "separator"},
    {type: "heading", label: "Planera"},
    {type: "item", label: "Kalender", href: "/health-care/calendar", id: "calendar", tags: ["overview"]},
    {type: "item", label: "Att-göra-lista", href: "/health-care/todo", id: "todo", tags: ["overview"]},
    {type: "separator"},
    {type: "heading", label: "Personligt"},
    {type: "item", label: "Profil", href: "/health-care/profile", id: "profile", tags: ["overview"]},
    {type: "item", label: "Notifieringar", href: "/health-care/notifications", id: "notifications"},
 ]
  const sidebarProps = {
    title: "Vårdadministration",
    rootHref: "/health-care",
    iconRef: "bi-file-medical",
  };
  return (
    <NavContext.Provider value={navItems}>
      <DataContext.Provider value={data}>
        <Suspense fallback={<Sidebar {...sidebarProps}>{children}</Sidebar>}>
          <NavStateProvider>
            <Sidebar {...sidebarProps}>
              <div className="container-xxl p-0 md-p3">
                {children}
              </div>
            </Sidebar>
          </NavStateProvider>
        </Suspense>
      </DataContext.Provider>
    </NavContext.Provider>
  )
}