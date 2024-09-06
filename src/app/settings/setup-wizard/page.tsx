"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Store } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Step, VenueData } from "./type";
import { steps } from "./steps";

const VenueSetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [venueData, setVenueData] = useState<VenueData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    managerName: "",
    description: "",
    capacity: 0,
    amenities: "",
    accessibilityInformation: "",
    logo: "",
    acceptCash: false,
    acceptCredit: false,
    acceptMobilePayment: false,
    alloweManagerToEditMenu: false,
    allowedChashierToRefund: false,
    allowedServersToModifyOrder: false,
    serviceFee: 0,
    currency: "",
  });

  const updateFields = (fields: Partial<VenueData>) => {
    setVenueData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const getCurrentStep = (): Step => {
    const step = steps[currentStep];
    return step || steps[0]!;
  };

  const CurrentStepComponent = getCurrentStep().component;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left side - Decorative */}
        <div className="relative flex w-1/3 flex-col justify-between overflow-hidden bg-indigo-600 p-8">
          <div className="relative z-10">
            <Store className="mb-4 h-12 w-12 text-white" />
            <h1 className="mb-2 text-3xl font-bold text-white">
              Set Up Your Venue
            </h1>
            <p className="text-indigo-200">
              Create your venue profile in just a few steps.
            </p>
          </div>
          <div className="relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`mb-4 flex items-center ${index <= currentStep ? "text-white" : "text-indigo-300"}`}
              >
                <div
                  className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${index <= currentStep ? "bg-white text-indigo-600" : "border-2 border-indigo-300"}`}
                >
                  {step.icon}
                </div>
                <span className="text-lg">{step.title}</span>
              </div>
            ))}
          </div>
          {/* Abstract shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white"></div>
            <div className="absolute bottom-0 right-0 h-60 w-60 translate-x-1/3 translate-y-1/3 transform rounded-full bg-white"></div>
          </div>
        </div>

        {/* Right side - Form */}
        <div
          className="w-2/3 overflow-y-auto p-8"
          style={{ maxHeight: "90vh" }}
        >
          <CurrentStepComponent data={venueData} updateFields={updateFields} />

          <div className="mt-8 flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
            >
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSetupWizard;
