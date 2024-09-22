"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"

export const description = "A collection of health charts."

export default function MemberSummary() {
  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 sm:flex-row ">
      
      <div className="grid w-full flex-1 gap-6">
        <Card
          className="max-w-xs" x-chunk="charts-01-chunk-5"
        >
          <CardContent className="flex gap-4 p-4">
            <div className="grid items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Agents</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  562/600
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Tasks</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  73/120
                </div>
              </div>
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-sm text-muted-foreground">Playground</div>
                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                  8/12
                </div>
              </div>
            </div>
            <ChartContainer
              config={{
                move: {
                  label: "Agents",
                  color: "orange",
                },
                exercise: {
                  label: "Tasks",
                  color: "lightblue",
                },
                stand: {
                  label: "Playground",
                  color: "green",
                },
              }}
              className="mx-auto aspect-square w-full max-w-[80%]"
            >
              <RadialBarChart
                margin={{
                  left: -10,
                  right: -10,
                  top: -10,
                  bottom: -10,
                }}
                data={[
                  {
                    activity: "stand",
                    value: (8 / 12) * 100,
                    fill: "var(--color-stand)",
                  },
                  {
                    activity: "exercise",
                    value: (46 / 60) * 100,
                    fill: "var(--color-exercise)",
                  },
                  {
                    activity: "move",
                    value: (245 / 360) * 100,
                    fill: "var(--color-move)",
                  },
                ]}
                innerRadius="20%"
                barSize={24}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar dataKey="value" background cornerRadius={5} />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
      </div>
    </div>
  )
}
