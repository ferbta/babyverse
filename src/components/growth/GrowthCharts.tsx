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

interface GrowthChartsProps {
    data: GrowthRecord[]
}

export function GrowthCharts({ data }: GrowthChartsProps) {
    const formattedData = data.map(record => ({
        ...record,
        date: new Date(record.measureDate).toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
        weight: record.weight || undefined,
        height: record.height || undefined,
        head: record.headCircumference || undefined,
    }))

    if (data.length === 0) {
        return (
            <Card className="h-[400px] flex items-center justify-center text-muted-foreground border-dashed border-2">
                <p>Chưa có dữ liệu biểu đồ</p>
            </Card>
        )
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
                    <CardHeader>
                        <CardTitle className="text-lg">Biểu đồ cân nặng (kg)</CardTitle>
                        <CardDescription>Theo dõi sự thay đổi cân nặng theo thời gian</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="height" className="mt-0">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Biểu đồ chiều cao (cm)</CardTitle>
                        <CardDescription>Theo dõi sự thay đổi chiều cao theo thời gian</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 5', 'dataMax + 5']}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="height"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
