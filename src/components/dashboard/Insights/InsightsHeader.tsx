import { CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { TPeriod } from "./Insights";

interface InsightsHeaderProps {
    selectedDate: string | null;
    period: TPeriod;
    setSelectedDate: (date: string | null) => void;
    setPeriod: (period: TPeriod) => void;
}

export const InsightsHeader = ({
    selectedDate,
    period,
    setSelectedDate,
    setPeriod,
}: InsightsHeaderProps) => (
       <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-8 gap-4">
        <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2">
                <span className="bg-violet-100 p-1 rounded-md text-violet-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </span>
                <CardTitle className="text-base font-bold">
                    {selectedDate ? `Hourly Activity (${format(new Date(selectedDate), 'MMM d, yyyy')})` : "Revenue Trend"}
                </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
                {selectedDate 
                    ? "Hourly breakdown for the selected date"
                    : (
                        <>
                            {period === 'daily' && "Daily performance (Last 30 Days)"}
                            {period === 'monthly' && "Monthly performance (Last 12 Months)"}
                            {period === 'yearly' && "Annual performance (Last 5 Years)"}
                        </>
                    )
                }
            </p>
        </div>
        
        <div className="flex items-center gap-2">
            {selectedDate && (
                <button 
                    onClick={() => setSelectedDate(null)}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                    ← Back to Daily
                </button>
            )}
            
            {!selectedDate && (
                <div className="flex items-center p-1 bg-muted rounded-lg">
                    <button 
                        onClick={() => setPeriod('daily')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === 'daily' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Daily
                    </button>
                    <button 
                        onClick={() => setPeriod('monthly')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setPeriod('yearly')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === 'yearly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Yearly
                    </button>
                </div>
            )}
        </div>
      </CardHeader>
    )