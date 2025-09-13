"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

type Calendar28Props = {
  name: string;
  label?: string;
  defaultValue?: string; // เช่น "2025-06-01" หรือ "June 01, 2025"
  placeholder?: string;
  readonly?: boolean;
  className?: string;
  required?: boolean;
  disableTyping?: boolean; // true = ห้ามพิมพ์ในช่อง input
};

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function parseDateFlexible(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export const Calendar28 = (props: Calendar28Props) => {
  const {
    name,
    label,
    defaultValue,
    placeholder = "June 01, 2025",
    readonly = false,
    className = "",
    required = false,
    disableTyping = false,
  } = props;

  const initialDate = parseDateFlexible(defaultValue);

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [month, setMonth] = React.useState<Date | undefined>(initialDate);
  const [value, setValue] = React.useState<string>(formatDate(initialDate));

  return (
    <div className="mb-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-semibold block mb-1">
          {label}
        </Label>
      )}
      <div className="h-1" />
      <div className="relative">
        <Input
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          className={`pr-10 ${className} focus-visible:ring-offset-0 focus-visible:ring-1`}
          readOnly={readonly || disableTyping}
          required={required}
          onChange={(e) => {
            if (readonly || disableTyping) return;
            const raw = e.target.value;
            setValue(raw);
            const d = parseDateFlexible(raw);
            if (d) {
              setDate(d);
              setMonth(d);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              aria-label="Select date"
            >
              <CalendarIcon className="size-3.5" />
            </Button>
          </PopoverTrigger>

          {/* ทำให้ป๊อปโอเวอร์ “ทึบ” ไม่โปร่งแสง */}
          <PopoverContent
            className="w-auto overflow-hidden p-3 
             bg-[var(--color-brand-background)] 
             rounded-2xl border border-black/30 
             font-[var(--font-alt)] shadow-lg"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                setDate(d);
                setValue(formatDate(d));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
