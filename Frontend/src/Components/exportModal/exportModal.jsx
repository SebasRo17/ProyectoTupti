import React, { useState } from 'react';
import './exportModal.css';

const ExportModal = ({ isOpen, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportType, setExportType] = useState('excel');
  const [dateError, setDateError] = useState('');

  const validateDateRange = (start, end, type) => {
    if (!start || !end) {
        setDateError('Ambas fechas son requeridas');
        return false;
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (endDate < startDate) {
        setDateError('La fecha final debe ser mayor a la fecha inicial');
        return false;
    }

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
      <div className={`modal-content2 ${dateError ? 'has-error' : ''}`}>
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

          <div className="date-container1">
            <div className="date-group1">
                <label>Fecha inicio</label>
                <input 
                    type="date"
                    value={startDate}
                    className={dateError ? 'error' : ''}
                    onChange={(e) => {
                        setStartDate(e.target.value);
                        validateDateRange(e.target.value, endDate, exportType);
                    }}
                />
            </div>
            <div className="date-group1">
                <label>Fecha fin</label>
                <input 
                    type="date"
                    value={endDate}
                    className={dateError ? 'error' : ''}
                    onChange={(e) => {
                        setEndDate(e.target.value);
                        validateDateRange(startDate, e.target.value, exportType);
                    }}
                />
               </div>
            {dateError && <div className="error-message1">{dateError}</div>}
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