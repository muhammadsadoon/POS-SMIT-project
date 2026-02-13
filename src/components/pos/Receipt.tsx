import { format } from "date-fns";

interface ReceiptProps {
    saleId: string | null;
    items: any[];
    total: number;
    date: Date;
    projectName?: string;
    hidden?: boolean;
}

export const Receipt = ({ saleId, items, total, date, projectName, hidden = false }: ReceiptProps) => {
    return (
        <div
            id="receipt-print"
            className={`bg-white p-4 w-[300px] text-black font-mono text-sm ${hidden ? "fixed -left-[9999px]" : ""}`}
            style={{ backgroundColor: "white", color: "black" }} // Ensure styles for capture
        >
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold uppercase">{projectName || "SalePOS"}</h1>
                <p className="text-xs text-gray-500">Receipt #{saleId?.slice(0, 8)}</p>
                <p className="text-xs text-gray-500">{format(date, "dd MMM yyyy, hh:mm a")}</p>
            </div>

            <div className="border-t border-b border-dashed border-gray-300 py-2 my-2 space-y-1">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                        <span className="flex-1 pr-2">
                            {item.product.name} <span className="text-xs text-gray-500">x{item.quantity}</span>
                        </span>
                        <span>{Number(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-800">
                <span>TOTAL</span>
                <span>Rs {total.toLocaleString()}</span>
            </div>

            <div className="text-center mt-6 text-xs text-gray-500">
                <p>Thank you for your purchase!</p>
                <p>No returns without receipt.</p>
            </div>
        </div>
    );
};
