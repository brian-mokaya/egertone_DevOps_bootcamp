import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Monitoring.css';

function Monitoring() {
  const [healthData, setHealthData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [healthResponse, metricsResponse] = await Promise.all([
        axios.get('/health'),
        axios.get('/metrics_summary'),
      ]);

      setHealthData(healthResponse.data);
      setMetricsData(metricsResponse.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch monitoring data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monitoring-container">
      <div className="monitoring-header">
        <h2>SMS Emmy - Monitoring Dashboard</h2>
        <div className="header-actions">
          <button onClick={fetchData} disabled={loading} className="refresh-button">
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">Error: {error}</div>
      )}

      <div className="monitoring-grid">
        {/* System Health Card */}
        <div className="monitoring-card health-card">
          <h3>System Health</h3>
          {loading && !healthData ? (
            <p>Loading health data...</p>
          ) : healthData ? (
            <div className="health-content">
              <div className={`health-indicator ${healthData.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                <div className="health-dot"></div>
                <span>{healthData.status === 'healthy' ? 'Healthy' : 'Unhealthy'}</span>
              </div>
              <div className="health-details">
                <p><strong>Database:</strong> {healthData.database}</p>
                <p><strong>Response Time:</strong> {healthData.stats?.response_time_ms || 'N/A'}ms</p>
                <p><strong>Version:</strong> {healthData.version}</p>
              </div>
            </div>
          ) : (
            <p>No health data available.</p>
          )}
        </div>

        {/* Message Statistics */}
        {metricsData?.summary && (
          <>
            <div className="monitoring-card">
              <h3>Total Messages</h3>
              <div className="metric-number">{metricsData.summary.total_messages}</div>
            </div>
            <div className="monitoring-card success-card">
              <h3>Successful</h3>
              <div className="metric-number">{metricsData.summary.success_count}</div>
            </div>
            <div className="monitoring-card error-card">
              <h3>Failed</h3>
              <div className="metric-number">{metricsData.summary.failed_count}</div>
            </div>
            <div className="monitoring-card pending-card">
              <h3>Pending</h3>
              <div className="metric-number">{metricsData.summary.pending_count}</div>
            </div>
            <div className="monitoring-card rate-card">
              <h3>Success Rate</h3>
              <div className="metric-number">{metricsData.summary.success_rate_percent}%</div>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      {metricsData?.recent_messages && (
        <div className="monitoring-card recent-activity">
          <h3>Recent Activity (Last 100 Messages)</h3>
          <div className="activity-list">
            {metricsData.recent_messages.slice(0, 10).map((message) => (
              <div key={message.id} className={`activity-item ${message.status}`}>
                <div className="activity-info">
                  <span className="activity-phone">{message.phone_number}</span>
                  <span className={`activity-status ${message.status}`}>
                    {message.status}
                  </span>
                </div>
                {message.error_message && (
                  <div className="activity-error">{message.error_message}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Monitoring;