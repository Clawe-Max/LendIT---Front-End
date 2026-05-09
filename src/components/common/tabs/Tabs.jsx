import { useState, ReactNode, isValidElement, cloneElement } from "react";
import { cn } from "../../../lib/utils";
import { TabsContext, useTabsContext } from "./TabsContext";

function Tabs({ className, defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }) {
  return <div className={className}>{children}</div>;
}

function TabsTrigger({ value, children, className, asChild = false }) {
  const { activeTab, setActiveTab } = useTabsContext();

  const isActive = activeTab === value;

  const props = {
    onClick: () => setActiveTab(value),
    "data-state": isActive ? "active" : "inactive",
    className: cn(className)
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...children.props,
      ...props,

      onClick: (e) => {
        props.onClick?.(e);
        children.props.onClick?.(e);
      },

      className: cn(children.props.className, props.className)
    });
  }

  return (
    <button
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setActiveTab(value)}
      className={cn(className)}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className }) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
