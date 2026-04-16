"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@/components/Icon";

export default function SettingsPage() {
  const [country, setCountry] = useState("DE");

  useEffect(() => {
    const saved = localStorage.getItem("app_country");
    if (saved) setCountry(saved);
  }, []);

  const handleCountryChange = (value: string | null) => {
    if (value) {
      setCountry(value);
      localStorage.setItem("app_country", value);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="settings" className="text-2xl text-primary" />
        <h1 className="text-3xl font-bold text-on-surface font-geist">Einstellungen</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 cloud-shadow ghost-border space-y-6">
        <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
          <Icon name="public" className="w-5 h-5" />
          Region & Sprache
        </h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="label-md text-on-surface-variant">Land auswählen</Label>
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger className="bg-surface-container-high border-none w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DE">Deutschland 🇩🇪</SelectItem>
                <SelectItem value="AT">Österreich 🇦🇹</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-on-surface-variant mt-2">
              {country === "AT" 
                ? "In Österreich ist das Pickerl (Vignette) bis zu 4 Monate nach Ablauf gültig." 
                : "Standard-Einstellungen für Deutschland."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
