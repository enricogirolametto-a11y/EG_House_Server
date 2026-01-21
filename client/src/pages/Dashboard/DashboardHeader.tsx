import { UserButton } from "@clerk/clerk-react";

interface HeaderProps {
  title: string;
}

export function DashboardHeader({ title }: HeaderProps) {

  return (

    <div className="flex justify-between items-center border-b pb-4">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">Status: Online</span>
        <UserButton />
      </div>
    </div>
  );
}
