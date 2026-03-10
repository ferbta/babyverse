'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GrowthRecord } from '@/types'
import { GROWTH_STANDARDS } from '@/lib/constants/growth-standards'
import { differenceInMonths } from 'date-fns'

interface GrowthChartsProps {
    data: GrowthRecord[]
    gender?: string
    birthDate?: Date | string
}

export function GrowthCharts({ data, gender, birthDate }: GrowthChartsProps) {
    // Determine which standards to use
    // Support more gender labels just in case
    const genderLower = (gender || '').toLowerCase()
    const isBoy = genderLower === 'male' || genderLower === 'nam' || genderLower === 'boy'
    const standards = isBoy ? GROWTH_STANDARDS.boys : GROWTH_STANDARDS.girls

    // Calculate the maximum age to display (at least 24 months)
    let maxMonth = 24
    if (birthDate && data.length > 0) {
        const birth = new Date(birthDate)
        data.forEach(record => {
            const age = differenceInMonths(new Date(record.measureDate), birth)
            if (age > maxMonth) maxMonth = age
        })
    }
    // Limit to a reasonable max, e.g., 60 months (5 years) if we had data, 
    // but for now let's just show up to what we have.
    maxMonth = Math.min(maxMonth, 60)

    // Prepare chart data
    const chartData = Array.from({ length: maxMonth + 1 }, (_, i) => {
        const standardData = i <= 24 ? {
            p3: standards.weight[i].p3,
            p50: standards.weight[i].p50,
            p97: standards.weight[i].p97,
            h3: standards.length[i].p3,
            h50: standards.length[i].p50,
            h97: standards.length[i].p97,
        } : {
            p3: null, p50: null, p97: null,
            h3: null, h50: null, h97: null,
        }

        const point = {
            month: i,
            ...standardData,
            weight: null as number | null,
            height: null as number | null,
        }

        if (birthDate) {
            const birth = new Date(birthDate)
            const recordsInMonth = data.filter(record => {
                const ageMonths = differenceInMonths(new Date(record.measureDate), birth)
                return ageMonths === i
            })

            if (recordsInMonth.length > 0) {
                // If multiple records in a month, take the last one
                const latestRecord = recordsInMonth[recordsInMonth.length - 1]
                point.weight = latestRecord.weight ?? null
                point.height = latestRecord.height ?? null
            }
        }

        return point
    })

    if (data.length === 0) {
        return (
            <Card className="h-[400px] flex items-center justify-center text-muted-foreground border-dashed border-2">
                <p>Chưa có dữ liệu biểu đồ. Hãy thêm số đo đầu tiên của bé.</p>
            </Card>
        )
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const weightPoint = payload.find((p: any) => p.dataKey === 'weight')
            const heightPoint = payload.find((p: any) => p.dataKey === 'height')

            const weightValue = weightPoint?.value
            const heightValue = heightPoint?.value

            return (
                <div className="bg-white dark:bg-slate-900 p-3 border rounded-lg shadow-lg text-sm">
                    <p className="font-bold mb-2">Tháng {label}</p>
                    {weightValue !== null && weightValue !== undefined && (
                        <div className="space-y-1 mb-2">
                            <p className="text-pink-600 font-medium">Bé: {weightValue} kg</p>
                            {label <= 24 && (
                                <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground border-t pt-1">
                                    <div>P3: {payload.find((p: any) => p.dataKey === 'p3')?.value}</div>
                                    <div>P50: {payload.find((p: any) => p.dataKey === 'p50')?.value}</div>
                                    <div>P97: {payload.find((p: any) => p.dataKey === 'p97')?.value}</div>
                                </div>
                            )}
                        </div>
                    )}
                    {heightValue !== null && heightValue !== undefined && (
                        <div className="space-y-1">
                            <p className="text-purple-600 font-medium">Bé: {heightValue} cm</p>
                            {label <= 24 && (
                                <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground border-t pt-1">
                                    <div>P3: {payload.find((p: any) => p.dataKey === 'h3')?.value}</div>
                                    <div>P50: {payload.find((p: any) => p.dataKey === 'h50')?.value}</div>
                                    <div>P97: {payload.find((p: any) => p.dataKey === 'h97')?.value}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        }
        return null
    }

    return (
        <Tabs defaultValue="weight" className="w-full">
            <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[300px] grid-cols-2">
                    <TabsTrigger value="weight">Cân nặng</TabsTrigger>
                    <TabsTrigger value="height">Chiều cao</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="weight" className="mt-0">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                            Biểu đồ cân nặng (kg)
                            <div className="flex gap-4 text-[10px] font-normal items-center">
                                <div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-pink-500 rounded-full" /> Bé</div>
                                <div className="flex items-center gap-1"><div className="w-4 h-0.5 border-t border-dashed border-slate-300" /> WHO</div>
                            </div>
                        </CardTitle>
                        <CardDescription>So sánh cân nặng của bé với chuẩn WHO</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    name="Tháng"
                                    unit="th"
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip content={<CustomTooltip />} />

                                <Line type="monotone" dataKey="p3" stroke="#cbd5e1" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                                <Line type="monotone" dataKey="p50" stroke="#94a3b8" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                                <Line type="monotone" dataKey="p97" stroke="#cbd5e1" strokeDasharray="5 5" dot={false} strokeWidth={1} />

                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    connectNulls
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="height" className="mt-0">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                            Biểu đồ chiều cao (cm)
                            <div className="flex gap-4 text-[10px] font-normal items-center">
                                <div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-purple-500 rounded-full" /> Bé</div>
                                <div className="flex items-center gap-1"><div className="w-4 h-0.5 border-t border-dashed border-slate-300" /> WHO</div>
                            </div>
                        </CardTitle>
                        <CardDescription>So sánh chiều cao của bé với chuẩn WHO</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    name="Tháng"
                                    unit="th"
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip content={<CustomTooltip />} />

                                <Line type="monotone" dataKey="h3" stroke="#cbd5e1" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                                <Line type="monotone" dataKey="h50" stroke="#94a3b8" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                                <Line type="monotone" dataKey="h97" stroke="#cbd5e1" strokeDasharray="5 5" dot={false} strokeWidth={1} />

                                <Line
                                    type="monotone"
                                    dataKey="height"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    connectNulls
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
