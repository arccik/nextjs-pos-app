"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Step, StoreData } from "./type";
import StoreInfoStep from "./steps/StoreInfoStep";
import ServiceFeeStep from "./steps/ServiceFeeStep";
import AddressStep from "./steps/AddressStep";
import LogoStep from "./steps/LogoStep";
import { api } from "@/trpc/react";

const StoreSetupWizard: React.FC = () => {
  const createStoreMutation = api.settings.create.useMutation({
    onSuccess: () => {
      console.log("Store created successfully");
    },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [storeData, setStoreData] = useState<StoreData>({
    name: "",
    serviceFee: 0,
    address: "",
    logo: "",
  });

  const steps: Step[] = [
    { title: "Store Info", component: StoreInfoStep },
    { title: "Service Fee", component: ServiceFeeStep },
    { title: "Address", component: AddressStep },
    { title: "Logo", component: LogoStep },
  ];

  const updateFields = (fields: Partial<StoreData>) => {
    setStoreData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const getCurrentStep = (): Step => {
    const step = steps[currentStep]!;
    return step || steps[0];
  };

  const CurrentStepComponent = getCurrentStep().component;

  const handleSubmit = () => {
    createStoreMutation.mutate({ ...storeData, updatedAt: new Date() });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left side - Decorative */}
        <div className="relative flex w-2/5 flex-col justify-between overflow-hidden bg-indigo-600 p-8">
          <div className="relative z-10">
            <Store className="mb-4 h-12 w-12 text-white" />
            <h1 className="mb-2 text-3xl font-bold text-white">
              Set Up Your Store
            </h1>
            <p className="text-indigo-200">
              Create your online presence in just a few steps.
            </p>
          </div>
          <div className="relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`mb-2 flex items-center ${index <= currentStep ? "text-white" : "text-indigo-300"}`}
              >
                <div
                  className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${index <= currentStep ? "bg-white text-indigo-600" : "border-2 border-indigo-300"}`}
                >
                  {index + 1}
                </div>
                {step.title}
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
        <div className="w-3/5 p-8">
          <CurrentStepComponent data={storeData} updateFields={updateFields} />

          <div className="mt-8 flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>Submit</Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSetupWizard;
