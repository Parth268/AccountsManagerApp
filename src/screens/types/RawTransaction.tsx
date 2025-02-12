export type RawTransaction = {
    id?: string;
    type?: "receive" | "send";
    amount?: number;
    timestamp?: string;
  };
  
