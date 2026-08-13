"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { setupOwner } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OwnerSetupPage() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const result = await setupOwner({
      setupToken: form.get("setupToken"),
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    });
    setSaving(false);
    setSuccess(result.success);
    setMessage(result.success ? "Owner account created. You can now sign in." : result.error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader><Image src="/logo.jpg" alt="TSM Mobiles" width={96} height={96} className="mx-auto mb-3 h-24 w-24 rounded-xl object-cover" priority /><CardTitle className="text-center">Set up TSM Mobiles owner</CardTitle></CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4"><p className="text-sm text-emerald-700">{message}</p><Link href="/auth/login"><Button className="w-full">Sign in</Button></Link></div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {message && <p className="text-sm text-red-700">{message}</p>}
              <div><Label htmlFor="setupToken">Setup token</Label><Input id="setupToken" name="setupToken" type="password" required autoComplete="off" /></div>
              <div><Label htmlFor="name">Owner name</Label><Input id="name" name="name" required /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="email" /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={12} required autoComplete="new-password" /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Creating…" : "Create owner account"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
