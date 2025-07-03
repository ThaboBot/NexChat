"use client";

import React, { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsDialog() {
  const [notifications, setNotifications] = useState(true);
  const [selfDestructTimer, setSelfDestructTimer] = useState([30]);
  const { toast } = useToast();

  const handleSaveChanges = () => {
    // Here you would typically save the settings to a backend or local storage
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Settings className="h-6 w-6 text-primary"/> App Settings</DialogTitle>
        <DialogDescription>
          Manage your application preferences here.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="notifications-switch" className="flex flex-col space-y-1">
            <span>Desktop Notifications</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive notifications on your desktop.
            </span>
          </Label>
          <Switch 
            id="notifications-switch" 
            checked={notifications} 
            onCheckedChange={setNotifications} 
          />
        </div>

        <div className="space-y-3">
           <Label htmlFor="self-destruct-timer" className="flex flex-col space-y-1">
            <span>Default Self-Destruct Timer</span>
             <span className="font-normal leading-snug text-muted-foreground">
              Set default time for messages to self-destruct.
            </span>
          </Label>
          <div className="flex items-center gap-4 pt-2">
            <Slider
              id="self-destruct-timer"
              min={5}
              max={300}
              step={5}
              value={selfDestructTimer}
              onValueChange={setSelfDestructTimer}
            />
            <span className="text-sm font-medium w-12 text-center bg-muted px-2 py-1 rounded-md">{selfDestructTimer[0]}s</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
}
