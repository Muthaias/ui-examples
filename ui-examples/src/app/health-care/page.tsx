"use client"
import { useNav } from "@/contexts";
import Link from "next/link";

export default function Home() {
  const navItems = useNav();
  return (
    <>
      <h2>Health care app demo</h2>
      <p>The following are example pages to demonstrate layout an interaction behaviors. These documents do not aim to show anything related to a final design.</p>
      <ul>
        {navItems.filter(n => n.type === "item").map((ni, index) => (
          <li key={index}><Link href={ni.href}>{ni.label}</Link></li>
        ))}
      </ul>
    </>
  )
}
