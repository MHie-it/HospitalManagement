import React from 'react';
import { Card } from '@/components/ui/card';
import { Circle } from 'lucide-react';

const EmptyState = ({ filter }) => {
    return (
        <Card className="p-8 text-center border-0 bg-gradient-to-r from-blue-50 to-pink-50 shadow-md mt-5">
            <div className="space-y-3">
                <Circle className="mx-auto size-12 text-gray-400" />
                <div>
                    <h3 className="font-medium text-gray-700">
                        {filter === "active"
                            ? "Không có khoa nào đang hoạt động."
                            : filter === "completed"
                                ? "Chưa có khoa nào hoàn thành."
                                : "Chưa có khoa nào."}
                    </h3>
                </div>
                <p className="text-sm text-gray-500">
                    {filter === "all"
                        ? "Thêm khoa đầu tiên để bắt đầu!"
                        : `Chuyển sang "tất cả" để thấy những khoa ${filter === "active" ? "đã hoàn thành." : "đang hoạt động."}`}
                </p>
            </div>
        </Card>
    );
};

export default EmptyState;