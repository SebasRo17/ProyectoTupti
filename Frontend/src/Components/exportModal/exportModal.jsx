import React, { useState } from 'react';
import './exportModal.css';

const ExportModal = ({ isOpen, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');

  const validateDateRange = (start, end, type) => {
    if (!start || !end) return true;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (type === 'excel' && diffDays > 7) {
      setDateError('Para Excel, el rango máximo es de 7 días');
      return false;
    }
    if (type === 'pdf' && diffDays > 15) {
      setDateError('Para PDF, el rango máximo es de 15 días');
      return false;
    }
    
    setDateError('');
    return true;
  };

  const isFormValid = () => {
    return selectedStatus !== '' && 
           documentType !== '' && 
           startDate !== '' && 
           endDate !== '' && 
           !dateError;
  };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay2">
      <div className="modal-content2">
        <h2>Reporte de ventas</h2>
        <form>
          <div className="form-group">
            <label>Estado Compras</label>
            <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={!selectedStatus ? 'required' : ''}
            required
            >
              <option value="">Seleccionar estado</option>
              <option value="canceladas">Canceladas</option>
              <option value="reembolsadas">Reembolsadas</option>
              <option value="confirmadas">Confirmadas</option>
              <option value="completas">Completas</option>
              <option value="todos">Todos las órdenes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de documento</label>
            <select 
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className={!documentType ? 'required' : ''}
            required
            >
              <option value="">Seleccionar tipo</option>
              <option value="excel">Reporte de liquidaciones - Excel</option>
              <option value="pdf">Reporte de liquidaciones - PDF</option>
            </select>
          </div>

          <div className="date-container">
            <div className="date-group">
                <label>Fecha inicio</label>
                <input 
                type="date" 
                value={startDate}
                onChange={(e) => {
                    setStartDate(e.target.value);
                    validateDateRange(e.target.value, endDate, dateError);
                }}
                
                />
            </div>
            <div className="date-group">
                <label>Fecha fin</label>
                <input 
                type="date"
                value={endDate}
                onChange={(e) => {
                    setEndDate(e.target.value);
                    validateDateRange(startDate, e.target.value, dateError);
                }}
                />
                {dateError && <p className="error-message">{dateError}</p>}
                  </div>
            
            </div>

          <div className="button-group">
            <button type="button" className="cancel-btn1" onClick={onClose}>
              Cancelar
            </button>
            <button 
            type="button" 
            className="download-btn"
            disabled={!isFormValid()}
            >
            Descargar documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal;