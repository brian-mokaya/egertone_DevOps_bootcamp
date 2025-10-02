import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Results.css';

function Results() {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/metrics_summary');
      setMetricsData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error">Error: {error}</div>
        <button onClick={fetchMetrics} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const { summary, recent_messages } = metricsData || {};

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>SMS Processing Results</h2>
        <p>View the status of your bulk SMS messages</p>
        <button onClick={fetchMetrics} className="refresh-button">
          Refresh Data
        </button>
      </div>

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{summary.total_messages}</div>
            <div className="stat-label">Total Messages</div>
          </div>
          <div className="stat-card success">
            <div className="stat-number">{summary.success_count}</div>
            <div className="stat-label">Successful</div>
          </div>
          <div className="stat-card error">
            <div className="stat-number">{summary.failed_count}</div>
            <div className="stat-label">Failed</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{summary.pending_count}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{summary.success_rate_percent}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      )}

      <div className="messages-section">
        <h3>Recent Messages</h3>
        {recent_messages && recent_messages.length > 0 ? (
          <div className="messages-table">
            <div className="table-header">
              <div>ID</div>
              <div>Phone Number</div>
              <div>Status</div>
              <div>Error Message</div>
            </div>
            {recent_messages.map((message) => (
              <div key={message.id} className={`table-row ${message.status}`}>
                <div>{message.id}</div>
                <div>{message.phone_number}</div>
                <div className={`status-badge ${message.status}`}>
                  {message.status}
                </div>
                <div>{message.error_message || '-'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-messages">No messages found</div>
        )}
      </div>
    </div>
  );
}

export default Results;