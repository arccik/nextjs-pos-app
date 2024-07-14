import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { useStore } from "@/store";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function AddSpecialRequest() {
  const [request, setRequest] = useState("");
  const [show, setShow] = useState(false);
  //   const { addSpecialRequest } = useStore();
  const handleSave = () => {
    // addSpecialRequest(request);
    setShow(false);
  };
  return (
    <div className="w-full">
      <Button
        onClick={() => setShow((prev) => !prev)}
        variant="ghost"
        className="w-full font-mono"
      >
        {show ? (
          <Cross2Icon className="mr-1" />
        ) : (
          <Pencil size="1rem" className="mr-1" />
        )}
        {show ? "Remove Special request" : "Add Special Request"}
      </Button>
      {show && (
        <>
          <Textarea
            autoFocus
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            className="h-40 w-full rounded-lg border p-2"
          />
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </>
      )}
    </div>
  );
}
