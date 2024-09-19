"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import useSWR from 'swr'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



const fetcher = (...args) => fetch(...args).then(res => res.json())

export function ChannelSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const { data, isLoading, error } = useSWR(`/api/channels`, fetcher)

  console.log("CHANNELS", data)

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <div>carregando...</div>
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.channels.find((channel) => channel.name === value).name
            : "Select channel..."}
          <ChevronsUpDown className="ml-2 h-4  shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" border p-0">
        <Command>
          <CommandInput placeholder="Search channel..." />
          <CommandList>
            <CommandEmpty>No channel found.</CommandEmpty>
            <CommandGroup>
              {data.channels.map((channel) => (
                <CommandItem
                  key={channel.name}
                  value={channel.name}
                  onSelect={(currentValue) => {
                    console.log(currentValue, value)
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === channel.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
