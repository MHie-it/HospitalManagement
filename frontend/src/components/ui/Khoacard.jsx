import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, SquarePen, Trash2, CheckCircle2, Circle } from "lucide-react";

const Khoacard = ({ khoa, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(khoa?.tenKhoa || "");

  // Dữ liệu mock - giả sử khoa có status
  const isActive = khoa?.status === "active" || khoa?.isActive !== false;

  const handleSave = () => {
    setIsEditing(false);
    // Chỉ UI, không có logic thật
  };

  const handleCancel = () => {
    setEditedName(khoa?.tenKhoa || "");
    setIsEditing(false);
  };

  if (!khoa) return null;

  return (
    <Card className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group border border-gray-200">
      <div className="flex items-center gap-4">
        {/* Checkbox bên trái */}
        {/* <div className="flex-shrink-0">
          {isActive ? (
            <CheckCircle2 className="size-5 text-green-500" />
          ) : (
            <Circle className="size-5 text-gray-400" />
          )}
        </div> */}

        {/* Nội dung khoa ở giữa */}
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 h-10 text-base border-gray-300 focus:border-blue-500"
                type="text"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-green-600 hover:text-green-700"
              >
                Lưu
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700"
              >
                Hủy
              </Button>
            </div>
          ) : (
            <p className="text-base text-gray-800 font-medium">
              {khoa.tenKhoa}
            </p>
          )}

          {/* Ngày tạo */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-gray-500" />
            <span className="text-xs text-gray-500">
              {khoa.createdAt
                ? new Date(khoa.createdAt).toLocaleString("vi-VN")
                : new Date().toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Icon chỉnh sửa & xóa - hiển thị khi hover */}
        <div className="hidden group-hover:flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <SquarePen className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            onClick={() => alert("Xóa khoa: " + khoa.tenKhoa)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Khoacard;