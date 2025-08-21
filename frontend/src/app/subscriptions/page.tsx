import Layout from "@/components/Layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions - YouTube"
};

export default function Subscriptions() {
  return (
    <Layout>
      <div
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
        <p className="text-sm text-gray-500">
          List of subscribed channels will appear here.
        </p>
      </div>
    </Layout>
  );
}
