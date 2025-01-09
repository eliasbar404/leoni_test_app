import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Group {
  id: string;
  name: string;
}

interface GroupSelectProps {
  name: string | null; // Name prop for form integration
  value: string | null; // Selected value as an integer or null
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void |string; // Change handler
}

const GroupSelect: React.FC<GroupSelectProps> = ({ name, value, onChange }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Group[]>('http://localhost:3000/groups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setGroups(response.data);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch groups');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="w-full">
      <label htmlFor="group-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Group
      </label>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading groups...</div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <select
          id="group-select"
          name={name??""}
          value={value || ''} // Controlled value
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        >
          <option value="">-- Select a Group --</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default GroupSelect;
