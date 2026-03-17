"use client";
import React from "react";
import { useIncidents } from "../../../../hooks/useIncidents";

export default function MyReports() {
  const { incidents, fetchIncidents, updateIncident } = useIncidents();

  React.useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex-1">
      <h2 className="text-xl font-semibold mb-4">My Reports</h2>
      <ul className="space-y-3">
        {incidents.map((i) => (
          <li
            key={i.id}
            className="p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between"
          >
            <div>
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-gray-500">{i.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={i.status}
                onChange={(e) =>
                  updateIncident(i.id, { status: e.target.value as any })
                }
                className="border rounded"
              >
                <option value="pending">pending</option>
                <option value="active">active</option>
                <option value="resolved">resolved</option>
                <option value="verified">verified</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
