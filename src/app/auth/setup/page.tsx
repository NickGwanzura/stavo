"use client";

import { useEffect, useState } from "react";
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
  const [setupToken, setSetupToken] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationLoaded, setInvitationLoaded] = useState(false);

  useEffect(() => {
    const invitation = new URLSearchParams(window.location.hash.slice(1));
    const token = invitation.get("token");
    if (!token) return;

    const loadInvitation = window.setTimeout(() => {
      setSetupToken(token);
      setName(invitation.get("name") || "");
      setEmail(invitation.get("email") || "");
      setInvitationLoaded(true);
    }, 0);
    return () => window.clearTimeout(loadInvitation);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const result = await setupOwner({ setupToken, name, email, password });
      setSuccess(result.success);
      setMessage(result.success ? "Owner account created. You can now sign in." : result.error);
    } catch {
      setMessage("Unable to create the account. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader><Image src="/logo.jpg" alt="TSM Mobiles" width={96} height={96} className="mx-auto mb-3 h-24 w-24 rounded-xl object-cover" priority /><CardTitle className="text-center">Create your TSM Mobiles account</CardTitle></CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4"><p className="text-sm text-emerald-700" role="status">{message}</p><Button asChild className="w-full"><Link href="/auth/login">Sign in</Link></Button></div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {message && <p className="text-sm text-red-700" role="alert">{message}</p>}
              {invitationLoaded ? (
                <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Your invitation has been loaded. Confirm your details and choose a password.</p>
              ) : (
                <div><Label htmlFor="setupToken">Setup token</Label><Input id="setupToken" name="setupToken" type="password" value={setupToken} onChange={(event) => setSetupToken(event.target.value)} required autoComplete="off" /></div>
              )}
              <div><Label htmlFor="name">Owner name</Label><Input id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} required autoComplete="new-password" /><p className="mt-1 text-xs text-slate-500">Use at least 12 characters.</p></div>
              <div><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={12} required autoComplete="new-password" /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Creating…" : "Create owner account"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
