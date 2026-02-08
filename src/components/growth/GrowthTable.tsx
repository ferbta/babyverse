'use client'

import { GrowthRecord } from '@/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GrowthTableProps {
    data: GrowthRecord[]
}

export function GrowthTable({ data }: GrowthTableProps) {
    // Sort by date descending for the table
    const sortedData = [...data].sort((a, b) =>
        new Date(b.measureDate).getTime() - new Date(a.measureDate).getTime()
    )

    if (data.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Lịch sử đo lường</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[150px]">Ngày đo</TableHead>
                                <TableHead>Cân nặng (kg)</TableHead>
                                <TableHead>Chiều cao (cm)</TableHead>
                                <TableHead>Vòng đầu (cm)</TableHead>
                                <TableHead className="max-w-[200px]">Ghi chú</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">
                                        {new Date(record.measureDate).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>
                                        {record.weight ? (
                                            <Badge variant="secondary" className="bg-pink-50 text-pink-600 hover:bg-pink-100">
                                                {record.weight} kg
                                            </Badge>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {record.height ? (
                                            <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-100">
                                                {record.height} cm
                                            </Badge>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {record.headCircumference ? `${record.headCircumference} cm` : '-'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm truncate max-w-[200px]" title={record.notes || ''}>
                                        {record.notes || '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
