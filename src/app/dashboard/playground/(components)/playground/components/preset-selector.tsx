"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { PopoverProps } from "@radix-ui/react-popover"
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

import { Preset } from "../data/presets"

interface PresetSelectorProps extends PopoverProps {
  presets: Preset[]
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function PresetSelector({ presets, ...props }: PresetSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<Preset>()
  const router = useRouter()
  
  const { data, isLoading, error } = useSWR(`/api/channels`, fetcher)

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <div>carregando...</div>
  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select a channel"
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          {selectedPreset ? selectedPreset.name : "Select a channel..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search channels..." />
          <CommandList>
            <CommandEmpty>No channels found.</CommandEmpty>
            <CommandGroup heading="All channels">
              {data.channels.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => {
                    setSelectedPreset(channel)
                    setOpen(false)
                  }}
                >
                  {channel.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedPreset?.id === channel._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
