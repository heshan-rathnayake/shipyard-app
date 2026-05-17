"use client";

import * as React from "react";

type BreadcrumbContextValue = {
  labels: Record<string, string>;
  setLabels: (labels: Record<string, string>) => void;
};

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  labels: {},
  setLabels: () => {},
});

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [labels, setLabels] = React.useState<Record<string, string>>({});

  const value = React.useMemo(() => ({ labels, setLabels }), [labels]);

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  return React.useContext(BreadcrumbContext);
}
