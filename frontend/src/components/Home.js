import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [csvFile, setCsvFile] = useState(null);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      showAlert('Please select a CSV file', 'error');
      return;
    }

    if (!messageTemplate.trim()) {
      showAlert('Please enter a message template', 'error');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('csvFile', csvFile);
    formData.append('message', messageTemplate);

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        showAlert(
          `Messages processed successfully! ${response.data.processed} successful, ${response.data.failed} failed.`,
          'success'
        );
        // Reset form
        setCsvFile(null);
        setMessageTemplate('');
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred while processing the file';
      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h2>SMS Bulk Messaging</h2>
        <p>Upload a CSV file with contacts and send personalized messages</p>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="csvFile">CSV File</label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0])}
              className="file-input"
            />
            <small>CSV should have columns: phone, name, company (optional)</small>
          </div>

          <div className="form-group">
            <label htmlFor="messageTemplate">Message Template</label>
            <textarea
              id="messageTemplate"
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              placeholder="Hello {name}, welcome to {company}! Your message here..."
              className="message-input"
              rows="4"
            />
            <small>Use {`{name}`} and {`{company}`} for personalization</small>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Processing...' : 'Upload and Send Messages'}
          </button>
        </form>

        <div className="info-section">
          <h3>CSV Format Example:</h3>
          <pre>
{`phone,name,company
+1234567890,John Doe,Acme Corp
+0987654321,Jane Smith,Tech Inc`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Home;