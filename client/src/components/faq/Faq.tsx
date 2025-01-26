import React from 'react'
import { Separator } from '../ui/separator'

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "How do I add new items to the inventory?",
    answer: "To add new items, navigate to the 'Inventory Management' section and click the '+Add Item' button. Fill in the required fields including SKU, product name, quantity, and category. You can also add optional details like description, supplier information, and reorder points."
  },
  {
    question: "What do the different stock status colors mean?",
    answer: "Our system uses color coding for quick status identification: Green indicates optimal stock levels, Yellow warns of low stock (below reorder point), Red shows critical stock levels or out of stock items, and Blue represents excess inventory that may need attention."
  },
  {
    question: "How can I generate inventory reports?",
    answer: "Access the 'Reports' section from the main dashboard. You can generate various reports including stock levels, movement history, valuation reports, and low stock alerts. Reports can be customized by date range and exported in PDF, CSV, or Excel formats."
  },
  {
    question: "What should I do if I notice a discrepancy in stock counts?",
    answer: "First, document the discrepancy in the system using the 'Stock Adjustment' feature. Then, perform a physical count to verify the actual quantity. If needed, use the 'Inventory Reconciliation' tool to correct the numbers and add notes explaining the adjustment for audit purposes."
  },
  {
    question: "How does the barcode scanning feature work?",
    answer: "Our system supports both handheld scanners and mobile device cameras for barcode scanning. Simply click the scan icon in any quantity field, scan the product's barcode, and the system will automatically identify the item and allow you to update quantities or view product details."
  },
  {
    question: "Can I set up automatic reorder notifications?",
    answer: "Yes! Go to 'Settings > Notifications' to configure automatic alerts. You can set minimum stock levels for each item, and the system will notify designated users via email or in-app notifications when inventory reaches these thresholds. You can also set up automated purchase order generation."
  }
];

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Faq = () => {
  return (
    <div className="container mx-auto px-4 max-w-7xl py-16">
      <h2 className="max-w-7xl mx-auto text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Frequently asked questions.
      </h2>

      <div className="grid grid-cols-1 gap-8 mt-8 lg:mt-16 md:grid-cols-2 xl:grid-cols-3">
        {faqData.map((faq, index) => (
          <div key={index}>
            <div className="inline-block p-3 text-white bg-primary rounded-lg">
              <QuestionIcon />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
                {faq.question}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;