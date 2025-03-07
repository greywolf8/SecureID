"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/" onClick={() => setOpen(false)} className="text-lg font-medium">
            Home
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-lg font-medium">
            About
          </Link>
          <Link href="/features" onClick={() => setOpen(false)} className="text-lg font-medium">
            Features
          </Link>
          <Link href="/developers" onClick={() => setOpen(false)} className="text-lg font-medium">
            Developers
          </Link>
          <div className="flex flex-col gap-2 mt-4">
            <Link href="/auth/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setOpen(false)}>
              <Button className="w-full">Register</Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

