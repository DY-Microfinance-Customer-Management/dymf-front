"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FormData = {
  name: string;
  nrcNo: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  loanType: string;
  cpNo: string;
  homeAddress: string;
  homePostalCode: string;
  officeAddress: string;
  officePostalCode: string;
  info: Record<string, string>;
};

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nrcNo: "",
    dateOfBirth: "",
    gender: "Male",
    phone: "",
    email: "",
    loanType: "Special Loan",
    cpNo: "",
    homeAddress: "",
    homePostalCode: "",
    officeAddress: "",
    officePostalCode: "",
    info: { info1: "", info2: "", info3: "", info4: "", info5: "" },
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("info")) {
      setFormData({
        ...formData,
        info: {
          ...formData.info,
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDropdownChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const basicInfoFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "NRC No.", name: "nrcNo", type: "text" },
    { label: "Date of Birth", name: "dateOfBirth", type: "date" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Email", name: "email", type: "email" },
  ];

  const addressFields = [
    { label: "Home Address", name: "homeAddress", span: 3 },
    { label: "Home Postal Code", name: "homePostalCode", span: 1 },
    { label: "Office Address", name: "officeAddress", span: 3 },
    { label: "Office Postal Code", name: "officePostalCode", span: 1 },
  ];

  return (
    <div className="flex flex-col p-10 space-y-8 min-h-screen">
      <h1 className="text-3xl font-bold">Customer Registration</h1>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-800">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Image Placeholder */}
            <div className="col-span-1 flex flex-col items-center justify-center border rounded-lg bg-gray-100 dark:bg-black h-80 relative">
              <label htmlFor="image-upload" className="w-full h-full">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="h-full w-full object-cover rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-gray-400 mb-4">Click here</span>
                    <span className="text-gray-400 mb-4">to upload image</span>
                  </div>
                )}
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
            </div>
            <div className="col-span-3 grid grid-cols-4 gap-4">
              {/* Basic Information Fields */}
              {basicInfoFields.map((field) => (
                <div key={field.name} className="col-span-2">
                  <Label>{field.label}</Label>
                  <Input name={field.name} type={field.type} value={formData[field.name as keyof FormData] as string} onChange={handleChange} />
                </div>
              ))}
              {/* Gender Dropdown */}
              <div className="col-span-2">
                <Label>Gender</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                      {formData.gender}
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDropdownChange("gender", "Male")}>Male</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropdownChange("gender", "Female")}>Female</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* CP No. with Search Button */}
              <div className="col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <Label>CP No.</Label>
                  <Input name="cpNo" value={formData.cpNo} onChange={handleChange} />
                </div>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Search</Button>
              </div>
              {/* Loan Type Dropdown */}
              <div className="col-span-2">
                <Label>Loan Type</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
                      {formData.loanType}
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDropdownChange("loanType", "Special Loan")}>Special Loan</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDropdownChange("loanType", "Normal Loan")}>Normal Loan</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-800">Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {addressFields.map((field) => (
              <div key={field.name} className={`col-span-${field.span}`}>
                <Label>{field.label}</Label>
                <Input name={field.name} value={formData[field.name as keyof FormData] as string} onChange={handleChange} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-800">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData.info).map((key) => (
              <div key={key} className="col-span-2">
                <Label>{key}</Label>
                <Input name={key} value={formData.info[key]} onChange={handleChange} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
      </div>
    </div>
  );
}