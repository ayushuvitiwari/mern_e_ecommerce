import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderSuccess() {
    const { id } = useParams();

    return (
        <div className="max-w-xl mx-auto my-12 px-4">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/90 text-center space-y-6">
                
                {/* Checkmark Icon badge */}
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100 flex items-center justify-center mx-auto text-4xl shadow-md shadow-emerald-100 animate-bounce">
                    ✓
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
                        Order Confirmed (Cash On Delivery)
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Thank You For Your Order!
                    </h1>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        Your electronic purchase has been logged into our Lucknow fulfillment warehouse and will be dispatched promptly.
                    </p>
                </div>

                {/* Order ID Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500">Order Reference ID:</span>
                    <span className="font-mono font-bold text-indigo-600 text-sm bg-white px-3 py-1 rounded-lg border border-slate-200">
                        {id}
                    </span>
                </div>

                {/* Next Steps Card */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-left text-xs space-y-2 text-slate-700">
                    <p className="font-bold text-slate-900">What happens next?</p>
                    <ul className="space-y-1 list-disc list-inside text-slate-600">
                        <li>Our warehouse team in Lucknow packs your items with protective wrap.</li>
                        <li>Courier partner verifies delivery details before delivery.</li>
                        <li>Keep exact cash or UPI QR scanner ready upon delivery.</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link 
                        to="/" 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-200 transition text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>

                <p className="text-[11px] text-slate-400">
                    Need support? Contact us anytime at <a href="tel:9335049033" className="text-indigo-600 font-bold underline">9335049033</a>
                </p>

            </div>
        </div>
    );
}
