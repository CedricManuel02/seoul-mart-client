import React from "react";

export default function Policy() {
  return (
    <section className="min-h-screen w-full bg-slate-50">
      <div className="w-11/12 xl:w-5/12 h-full m-auto py-10">
        <div className="bg-white p-4 border rounded">
          <header className="py-4">
            <h3 className="font-medium text-md">Store Policy</h3>
            <p className="text-slate-500 text-sm">
              Here's our store policy for clarification
            </p>
          </header>

          {/* Refund Policy */}
          <div className="py-2 text-sm">
            <h4 className="text-md font-medium">Refund Policy</h4>
            <h6 className="py-1">We will refund or exchange items when:</h6>
            <ul className="text-slate-700 list-disc px-4 py-2">
              <li>The package or product itself is damaged.</li>
              <li>It does not match the customer's original order.</li>
            </ul>
            <h6 className="py-1">Procedure for Refund:</h6>
            <ul className="text-slate-700 list-disc px-4 py-2">
              <li>Provide evidence of the damaged item with a receipt via store email or message.</li>
              <li>Return the damaged item with a receipt within 7 working days (shipping charges will be covered by Bella and Pepper).</li>
              <li>Refunds will be processed to the customer’s bank account or exchanged for another item.</li>
            </ul>
          </div>

          {/* Delivery Rules */}
          <div className="py-2 text-sm">
            <h4 className="text-md font-medium">Delivery Rules</h4>
            <h6 className="py-1">Our delivery policies include:</h6>
            <ul className="text-slate-700 list-disc px-4 py-2">
              <li>Orders are processed within 1-3 business days.</li>
              <li>Delivery times vary based on location and courier services.</li>
              <li>Customers will receive a tracking number once the order is shipped.</li>
              <li>If the package is lost in transit, customers should contact us immediately for resolution.</li>
            </ul>
          </div>

          {/* Personal Information */}
          <div className="py-2 text-sm">
            <h4 className="text-md font-medium">Personal Information</h4>
            <h6 className="py-1">Our privacy rules:</h6>
            <ul className="text-slate-700 list-disc px-4 py-2">
              <li>We collect only necessary information for order processing and customer service.</li>
              <li>Personal data is kept secure and not shared with third parties without consent.</li>
            </ul>
          </div>
            {/* Payment Information */}
            <div className="py-2 text-sm">
            <h4 className="text-md font-medium">Payment Methods</h4>
            <h6 className="py-1">Our payment method availables are:</h6>
            <ul className="text-slate-700 list-disc px-4 py-2">
              <li>Gcash</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
