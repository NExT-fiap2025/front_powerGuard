export interface EventData {
  id: string;
  location: string;
  estimatedDuration: number;
  actualDuration: number | null;
  damages: string;
  date: string;
  resolved: boolean;
  causes: string[];
}

export interface EventSummary {
  totalEvents: number;
  resolvedEvents: number;
  averageDuration: number;
  mostAffectedLocation: string;
  latestEventDate: string;
}