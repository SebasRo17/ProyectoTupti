import React, { useState } from 'react';
import { getPedidosForExport } from '../../Api/pedidoApi';
import * as XLSX from 'xlsx';
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

  const handleExport = async () => {
    try {
      const pedidos = await getPedidosForExport(selectedStatus, startDate, endDate);
      
      // Transformar datos para el Excel
      const excelData = pedidos.map(p => ({
        'N° Orden': p.pedido.idPedido,
        'Estado': getStatusText(p.pedido.estado),
        'Fecha': new Date(p.pedido.fechaPedido).toLocaleDateString(),
        'Cliente': p.usuario.nombre,
        'Email': p.usuario.email,
        'Dirección': `${p.direccion.callePrincipal} ${p.direccion.numeracion}, ${p.direccion.calleSecundaria}`,
        'Ciudad': p.direccion.ciudad,
        'Total Productos': p.productos.reduce((sum, prod) => sum + prod.cantidad, 0),
        'Valor Total': p.productos.reduce((sum, prod) => sum + (prod.precioUnitario * prod.cantidad), 0).toFixed(2)
      }));

      // Crear y descargar el archivo Excel
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
      
      // Generar nombre del archivo
      const fileName = `Reporte_Pedidos_${startDate}_${endDate}.xlsx`;
      XLSX.writeFile(wb, fileName);

      onClose();
    } catch (error) {
      console.error('Error al exportar:', error);
      setDateError('Error al generar el reporte');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: 'En Espera',
      1: 'Reembolsado',
      2: 'Entregado'
    };
    return statusMap[status] || 'Desconocido';
  };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay2">
      <div className={`modal-content2 ${dateError ? 'has-error' : ''}`}>
        <h2>Reporte de ventas</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Estado Compras</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={!selectedStatus ? 'required' : ''}
              required
            >
              <option value="">Seleccionar estado</option>
              <option value="espera">En Espera</option>
              <option value="entregada">Entregados</option>
              <option value="reembolsada">Reembolsados</option>
              <option value="todos">Todos los pedidos</option>
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
              onClick={handleExport}
            >
              Descargar Excel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal;