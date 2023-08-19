import { StatusIndicatorProps } from "@cloudscape-design/components"

export default function showStatus(status: number | undefined): { value: StatusIndicatorProps.Type | undefined, label: string } {
  switch (String(status)) {
    case "0": return { value: "pending", label: "Pending" }
    case "16": return { value: "success", label: "Running" }
    case "32": return { value: "loading", label: "Shutting-down" }
    case "48": return { value: "error", label: "Terminated" }
    case "64": return { value: "loading", label: "Stopping" }
    case "80": return { value: "stopped", label: "Stopped" }
    default: return { value: "error", label: "Error" }
  }
}