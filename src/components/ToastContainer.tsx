import React from 'react';
import { useApp } from '../AppContext';

const iconFor = (type: string) => {
  if (type === 'success') return 'fa-circle-check';
  if (type === 'error') return 'fa-triangle-exclamation';
  return 'fa-info-circle';
};

const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div className={`toast ${t.type}`} key={t.id}>
          <i className={`fa-solid ${iconFor(t.type)}`} /> <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
