import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getDetallesPedido, getLastPedidoByUserId } from "../../Api/pedidoApi";
import { Page, Text, View, Document, PDFViewer, StyleSheet, Image, pdf } from "@react-pdf/renderer";

// Definición de estilos
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        justifyContent: 'space-between'
    },
    logoT: {
        width: 225,
        height: 125,
        marginRight: 20,
        marginTop: -18,
    },
    automatico: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'left',
        fontSize: 8,
        textAlign: 'left',
        padding: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        fontFamily: 'Helvetica',
        marginLeft: 20,
    },
    autLine: {
        marginBottom: 10,
    },
    infoContainer: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginTop: 0,
        fontSize: 8,
        width: '100%',
    },
    infoLine: {
        marginBottom: 10,
    },
    barcode: {
        width: 200,
        height: 60,
        objectFit: 'contain'
    },
    section: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 8,
        marginBottom: 10
    },
    cliente: {
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        marginBottom: 10
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1
    },
    tableColHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        fontSize: 8,
        padding: 5
    },
    tableCol: {
        fontSize: 8,
        padding: 5,
        textAlign: 'center'
    },
    codPrincipal: { width: '12%' },
    cantidad: { width: '8%' },
    descripcion: { width: '40%', textAlign: 'left' },
    precioUnitario: { width: '12%', textAlign: 'right' },
    descuento: { width: '12%', textAlign: 'right' },
    precioTotal: { width: '16%', textAlign: 'right' },
    tableTotales: {
        width: '50%',
        alignSelf: 'flex-end',
        marginTop: 10,
        marginBottom: 10
    },
    rowTotales: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#000'
    },
    colLabelTotales: {
        width: '70%',
        padding: 5,
        fontSize: 8
    },
    colValueTotales: {
        width: '30%',
        padding: 5,
        fontSize: 8,
        textAlign: 'right'
    },
    descuentoLabel: {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold'
    }
});

// Añadir estas funciones auxiliares antes del componente InvoicePDF
const generateDigitoVerificador = (cadena) => {
    const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    
    for (let i = 0; i < cadena.length; i++) {
        suma += parseInt(cadena[i]) * coeficientes[i];
    }
    
    const modulo = suma % 11;
    const digito = 11 - modulo;
    
    return digito === 11 ? 0 : digito === 10 ? 1 : digito;
};

const generateClaveAcceso = (fecha, numeroFactura) => {
    const fechaFormateada = fecha.replace(/[^\d]/g, '').slice(0, 8); // ddmmaaaa
    const tipoComprobante = '01';
    const ruc = '1751345263001';
    const tipoAmbiente = '2';
    const serie = '001001';
    const secuencial = numeroFactura.toString().padStart(9, '0');
    const codigoNumerico = '41231533';
    const tipoEmision = '1';
    
    const baseClaveAcceso = `${fechaFormateada}${tipoComprobante}${ruc}${tipoAmbiente}${serie}${secuencial}${codigoNumerico}${tipoEmision}`;
    const digitoVerificador = generateDigitoVerificador(codigoNumerico);
    
    return `${baseClaveAcceso}${digitoVerificador}`;
};

// Modificar la exportación del componente InvoicePDF
const InvoicePDF = ({ idUsuario, forEmail = false }) => {
    const [invoiceData, setInvoiceData] = useState({
        customer: {
            name: "Cliente",
            address: "",
            ruc: ""
        },
        items: [],
        totales: {
            subtotal: 0,
            descuentos: 0,
            impuestos: 0,
            total: 0
        },
        invoiceNumber: "001-001-000000123",
        date: new Date().toLocaleDateString()
    });
    const [claveAcceso, setClaveAcceso] = useState('');
    const [numeroFactura, setNumeroFactura] = useState(1); // Contador para el número de factura
    const [fechaAutorizacion, setFechaAutorizacion] = useState('');
    const [totalesPorIva, setTotalesPorIva] = useState({});

    useEffect(() => {
        const fetchPedidoData = async () => {
            if (!idUsuario || isNaN(idUsuario)) {
                console.error('ID de usuario inválido:', idUsuario);
                return;
            }

            try {
                // Si es para email, asegurarse de que los datos estén cargados
                if (forEmail) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Leer datos del cliente del localStorage
                let clienteData;
                try {
                    const storedData = localStorage.getItem('clienteData');
                    console.log('Datos almacenados:', storedData); // Debugging
                    clienteData = JSON.parse(storedData);
                    console.log('Datos parseados:', clienteData); // Debugging
                } catch (error) {
                    console.error('Error al leer datos del cliente:', error);
                    clienteData = {
                        nombre: 'Consumidor Final',
                        identificacion: '9999999999999'
                    };
                }

                // Resto de la lógica de fetching
                const ultimoPedido = await getLastPedidoByUserId(idUsuario);
                const pedidoData = await getDetallesPedido(ultimoPedido.IdPedido);

                // Generar número de factura y clave de acceso
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString('es-EC', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                
                const claveAccesoGenerada = generateClaveAcceso(formattedDate, numeroFactura);
                setClaveAcceso(claveAccesoGenerada);

                // Generar fecha y hora de autorización
                const formattedDateTime = currentDate.toLocaleString('es-EC', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                setFechaAutorizacion(formattedDateTime);

                // Calcular subtotales por tipo de IVA
                const subtotalesPorIva = {};
                pedidoData.items.forEach(item => {
                    // Agregamos console.log para ver cada item
                    console.log('Item procesado:', item);
                    
                    // Obtener el IVA del objeto impuesto en lugar del producto
                    const iva = item.impuesto?.porcentaje || 0;
                    const subtotal = item.producto.precioUnitario * item.producto.cantidad;

                    // Redondeamos el IVA a un número entero para evitar problemas de precisión
                    const ivaKey = Math.round(iva);
                    
                    if (!subtotalesPorIva[ivaKey]) {
                        subtotalesPorIva[ivaKey] = 0;
                    }
                    subtotalesPorIva[ivaKey] += subtotal;
                    
                    // Agregamos console.log para ver los subtotales
                    console.log(`IVA ${ivaKey}%: Subtotal actual = ${subtotalesPorIva[ivaKey]}`);
                });

                console.log('Subtotales por IVA finales:', subtotalesPorIva);

                setTotalesPorIva(subtotalesPorIva);

                // Actualizar el estado con los datos del cliente
                setInvoiceData(prev => ({
                    ...prev,
                    pedidoInfo: ultimoPedido,
                    customer: {
                        name: clienteData?.nombre || 'Consumidor Final',
                        ruc: clienteData?.identificacion || '9999999999999'
                    },
                    items: pedidoData.items.map(item => ({
                        codigo: item.idCarritoDetalle || 'N/A',
                        cantidad: item.producto?.cantidad || 0,
                        descripcion: item.producto?.nombre || 'Sin nombre',
                        precioUnitario: item.producto?.precioUnitario || 0,
                        descuento: item.producto?.descuento || 0,
                        precioTotal: item.producto?.subtotal || 0
                    })),
                    totales: pedidoData.totales || {
                        subtotal: 0,
                        descuentos: 0,
                        impuestos: 0,
                        total: 0
                    },
                    invoiceNumber: `001-001-${numeroFactura.toString().padStart(9, '0')}`,
                    date: formattedDate
                }));

            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        fetchPedidoData();
    }, [idUsuario, numeroFactura, forEmail]);

    // En el render, agregar validaciones para evitar errores de undefined
    const renderPrecio = (valor) => {
        return typeof valor === 'number' ? `$${valor.toFixed(2)}` : '$0.00';
    };

    return (
      <Document>
        <Page style={styles.page}>
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Image 
                        style={styles.logoT}
                    src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1734638598/tupti_3_r82cww_dsbubc.png" 
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLine}>TUPTI:</Text>  
                        <Text style={styles.infoLine}>DIR MATRIZ: AV. 16 DE JULIO 123, QUITO - ECUADOR</Text>
                        <Text style={styles.infoLine}>DIR SUCURSAL: AV. 16 DE JULIO 123, QUITO - ECUADOR</Text>
                        <Text style={styles.infoLine}>CONTRIBUYENTE ESPECIAL NRO: 123456</Text>
                        <Text style={styles.infoLine}>OBLIGADO A LLEVAR CONTABILIDAD: SI</Text>
                    </View>
                </View>
                <View style={styles.automatico}>
                    <Text style={styles.autLine}>RUC: 1751345263001</Text>
                    <Text style={styles.autLine}>FACTURA    N°: {invoiceData.invoiceNumber}</Text>
                    <Text style={styles.autLine}>NO. DE AUTORIZACION:</Text>
                    <Text style={styles.autLine}>{claveAcceso}</Text>
                    <Text style={styles.autLine}>FECHA Y HORA DE AUTORIZACION:</Text>
                    <Text style={styles.autLine}>{fechaAutorizacion}</Text>
                    <Text style={styles.autLine}>AMBIENTE: PRODUCCIÓN</Text>
                    <Text style={styles.autLine}>EMISION: NORMAL</Text>
                    <Text style={styles.autLine}>CLAVE DE ACCESO:</Text>
                    <Text style={styles.autLine}>{claveAcceso}</Text>
                    {/* Removemos temporalmente la imagen del código de barras hasta resolver el problema CORS */}
                </View>
            </View>
          {/* Información del cliente */}
          <View style={styles.section}>
            <Text style={styles.cliente}>RAZON SOCIAL / NOMBRE Y APELLIDOS: {invoiceData.customer.name || 'Consumidor Final'}</Text>
            <Text style={styles.cliente}>RUCC/CI: {invoiceData.customer.ruc || '9999999999999'}</Text>  {/* Cambiamos .address por .ruc */}
            <Text style={styles.cliente}>FECHA DE EMISION: {invoiceData.date}</Text>
          </View>
  
          {/* Tabla de productos */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, styles.codPrincipal]}>
                    <Text>COD. PRINCIPAL</Text>
                </View>
                <View style={[styles.tableColHeader, styles.cantidad]}>
                    <Text>CANT.</Text>
                </View>
                <View style={[styles.tableColHeader, styles.descripcion]}>
                    <Text>DESCRIPCIÓN</Text>
                </View>
                <View style={[styles.tableColHeader, styles.precioUnitario]}>
                    <Text>PRECIO UNITARIO</Text>
                </View>
                <View style={[styles.tableColHeader, styles.descuento]}>
                    <Text>DESCUENTO</Text>
                </View>
                <View style={[styles.tableColHeader, styles.precioTotal]}>
                    <Text>PRECIO TOTAL</Text>
                </View>
            </View>
            {invoiceData.items.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                    <View style={[styles.tableCol, styles.codPrincipal]}>
                        <Text>{item.codigo}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.cantidad]}>
                        <Text>{item.cantidad}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.descripcion]}>
                        <Text>{item.descripcion}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.precioUnitario]}>
                        <Text>{renderPrecio(item.precioUnitario)}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.descuento]}>
                        <Text>{renderPrecio(item.descuento)}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.precioTotal]}>
                        <Text>{renderPrecio(item.precioTotal)}</Text>
                    </View>
                </View>
            ))}
          </View>
  
          {/* Tabla de Totales */}
          <View style={styles.tableTotales}>
            {/* Subtotales por tipo de IVA */}
            {Object.entries(totalesPorIva).sort(([ivaA], [ivaB]) => Number(ivaA) - Number(ivaB)).map(([iva, subtotal]) => (
                <View style={styles.rowTotales} key={`subtotal-${iva}`}>
                    <Text style={styles.colLabelTotales}>Subtotal IVA {iva}%</Text>
                    <Text style={styles.colValueTotales}>{renderPrecio(subtotal)}</Text>
                </View>
            ))}
            
            {/* Descuento */}
            <View style={styles.rowTotales}>
                <Text style={[styles.colLabelTotales, styles.descuentoLabel]}>DESCUENTO</Text>
                <Text style={styles.colValueTotales}>{renderPrecio(invoiceData.totales.descuentos)}</Text>
            </View>

            {/* Subtotal general */}
            <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>SUBTOTAL</Text>
                <Text style={styles.colValueTotales}>{renderPrecio(invoiceData.totales.subtotal)}</Text>
            </View>

            {/* IVAs */}
            {Object.entries(totalesPorIva).sort(([ivaA], [ivaB]) => Number(ivaA) - Number(ivaB)).map(([iva, subtotal]) => (
                <View style={styles.rowTotales} key={`iva-${iva}`}>
                    <Text style={styles.colLabelTotales}>IVA {iva}%</Text>
                    <Text style={styles.colValueTotales}>{renderPrecio(subtotal * (Number(iva)/100))}</Text>
                </View>
            ))}

            {/* Cuota de servicio */}
            <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>Cuota de servicio (8%)</Text>
                <Text style={styles.colValueTotales}>{renderPrecio(invoiceData.totales.subtotal * 0.08)}</Text>
            </View>

            {/* Valor Total */}
            <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>VALOR TOTAL</Text>
                <Text style={styles.colValueTotales}>
                    {renderPrecio(invoiceData.totales.total + (invoiceData.totales.subtotal * 0.08))}
                </Text>
            </View>
          </View>
  
          {/* Footer */}
          <Text style={styles.footer}>Gracias por su compra</Text>
        </Page>
      </Document>
    );
  };
  
// Modificar la función generatePdfBlob para incluir un tiempo de espera
const generatePdfBlob = async (idUsuario) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtener los datos del pedido primero
      const ultimoPedido = await getLastPedidoByUserId(idUsuario);
      const pedidoData = await getDetallesPedido(ultimoPedido.IdPedido);
      
      // Obtener datos del cliente del localStorage
      const clienteData = JSON.parse(localStorage.getItem('clienteData'));
      
      // Generar datos de factura
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('es-EC');
      const formattedDateTime = currentDate.toLocaleString('es-EC');
      const numeroFactura = ultimoPedido.IdPedido;
      const claveAcceso = generateClaveAcceso(formattedDate, numeroFactura);

      // Calcular subtotales por IVA
      const subtotalesPorIva = {};
      pedidoData.items.forEach(item => {
        const iva = item.impuesto?.porcentaje || 0;
        const subtotal = item.producto.precioUnitario * item.producto.cantidad;
        const ivaKey = Math.round(iva);
        if (!subtotalesPorIva[ivaKey]) {
          subtotalesPorIva[ivaKey] = 0;
        }
        subtotalesPorIva[ivaKey] += subtotal;
      });

      const pdfDoc = (
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Cabecera */}
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Image 
                  style={styles.logoT}
                  src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1734638598/tupti_3_r82cww_dsbubc.png"
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLine}>TUPTI</Text>
                  <Text style={styles.infoLine}>DIR MATRIZ: AV. 16 DE JULIO 123, QUITO - ECUADOR</Text>
                  <Text style={styles.infoLine}>DIR SUCURSAL: AV. 16 DE JULIO 123, QUITO - ECUADOR</Text>
                  <Text style={styles.infoLine}>CONTRIBUYENTE ESPECIAL NRO: 123456</Text>
                  <Text style={styles.infoLine}>OBLIGADO A LLEVAR CONTABILIDAD: SI</Text>
                </View>
              </View>

              <View style={styles.automatico}>
                <Text style={styles.autLine}>RUC: 1751345263001</Text>
                <Text style={styles.autLine}>FACTURA N°: 001-004-{numeroFactura.toString().padStart(9, '0')}</Text>
                <Text style={styles.autLine}>NO. DE AUTORIZACIÓN: {claveAcceso}</Text>
                <Text style={styles.autLine}>FECHA Y HORA DE AUTORIZACIÓN: {formattedDateTime}</Text>
                <Text style={styles.autLine}>AMBIENTE: PRODUCCIÓN</Text>
                <Text style={styles.autLine}>EMISIÓN: NORMAL</Text>
                <Text style={styles.autLine}>CLAVE DE ACCESO: {claveAcceso}</Text>
              </View>
            </View>

            {/* Información del cliente */}
            <View style={styles.section}>
              <Text style={styles.cliente}>RAZÓN SOCIAL / NOMBRES Y APELLIDOS: {clienteData?.nombre || 'Consumidor Final'}</Text>
              <Text style={styles.cliente}>RUC/CI: {clienteData?.identificacion || '9999999999999'}</Text>
              <Text style={styles.cliente}>FECHA DE EMISIÓN: {formattedDate}</Text>
            </View>

            {/* Tabla de productos */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, styles.codPrincipal]}>
                  <Text>CÓD. PRINCIPAL</Text>
                </View>
                <View style={[styles.tableColHeader, styles.cantidad]}>
                  <Text>CANT.</Text>
                </View>
                <View style={[styles.tableColHeader, styles.descripcion]}>
                  <Text>DESCRIPCIÓN</Text>
                </View>
                <View style={[styles.tableColHeader, styles.precioUnitario]}>
                  <Text>PRECIO UNITARIO</Text>
                </View>
                <View style={[styles.tableColHeader, styles.descuento]}>
                  <Text>DESCUENTO</Text>
                </View>
                <View style={[styles.tableColHeader, styles.precioTotal]}>
                  <Text>PRECIO TOTAL</Text>
                </View>
              </View>

              {pedidoData.items.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={[styles.tableCol, styles.codPrincipal]}>
                    <Text>{item.idCarritoDetalle}</Text>
                  </View>
                  <View style={[styles.tableCol, styles.cantidad]}>
                    <Text>{item.producto.cantidad}</Text>
                  </View>
                  <View style={[styles.tableCol, styles.descripcion]}>
                    <Text>{item.producto.nombre}</Text>
                  </View>
                  <View style={[styles.tableCol, styles.precioUnitario]}>
                    <Text>${item.producto.precioUnitario.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.tableCol, styles.descuento]}>
                    <Text>${item.producto.descuento.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.tableCol, styles.precioTotal]}>
                    <Text>${item.producto.subtotal.toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Totales */}
            <View style={styles.tableTotales}>
              {Object.entries(subtotalesPorIva).map(([iva, subtotal]) => (
                <View style={styles.rowTotales} key={`subtotal-${iva}`}>
                  <Text style={styles.colLabelTotales}>SUBTOTAL IVA {iva}%</Text>
                  <Text style={styles.colValueTotales}>${subtotal.toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.rowTotales}>
                <Text style={[styles.colLabelTotales, styles.descuentoLabel]}>DESCUENTO</Text>
                <Text style={styles.colValueTotales}>${pedidoData.totales.descuentos.toFixed(2)}</Text>
              </View>

              <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>SUBTOTAL</Text>
                <Text style={styles.colValueTotales}>${pedidoData.totales.subtotal.toFixed(2)}</Text>
              </View>

              {Object.entries(subtotalesPorIva).map(([iva, subtotal]) => (
                <View style={styles.rowTotales} key={`iva-${iva}`}>
                  <Text style={styles.colLabelTotales}>IVA {iva}%</Text>
                  <Text style={styles.colValueTotales}>${(subtotal * (Number(iva)/100)).toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>Cuota de servicio (8%)</Text>
                <Text style={styles.colValueTotales}>
                  ${(pedidoData.totales.subtotal * 0.08).toFixed(2)}
                </Text>
              </View>

              <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>VALOR TOTAL</Text>
                <Text style={styles.colValueTotales}>
                  ${(pedidoData.totales.total + (pedidoData.totales.subtotal * 0.08)).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>Gracias por su compra</Text>
          </Page>
        </Document>
      );

      // Generar el PDF con los datos completos
      const blob = await pdf(pdfDoc).toBlob();
      resolve(blob);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      reject(error);
    }
  });
};

const handlePaymentSuccess = async (orderId) => {
    try {
        await capturePaypalPayment(orderId);
        
        if (pedido && pedido.idPedido) {
            setIsLoading(true);
            
            const clienteData = JSON.parse(localStorage.getItem('clienteData'));
            if (!clienteData) {
                throw new Error('Datos del cliente no encontrados');
            }

            const pdfBlob = await generatePdfBlob(idUsuario);
            
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64data = reader.result.split(',')[1];
                    
                    // Calcular el total incluyendo la cuota de servicio
                    const subtotal = detallesPedido.totales.subtotal;
                    const serviceFee = subtotal * 0.08;
                    const totalConServicio = detallesPedido.totales.total + serviceFee;
                    
                    // Convertir explícitamente a número y redondear a 2 decimales
                    const totalFactura = parseFloat(totalConServicio.toFixed(2));
                    
                    console.log('Total a enviar:', totalFactura, typeof totalFactura);
                    
                    await enviarFacturaPorEmail(
                        pedido.idPedido, 
                        base64data, 
                        totalFactura
                    );
                    
                    console.log('Factura enviada correctamente');
                    setPaymentStatus('success');
                } catch (error) {
                    console.error('Error al enviar la factura:', error);
                    alert('Error al enviar la factura. Por favor, contacte al soporte.');
                }
            };
            reader.readAsDataURL(pdfBlob);
        }
    } catch (error) {
        // ...existing code...
    }
};

export { InvoicePDF, generatePdfBlob };
  
  // Componente del visor del PDF
  const App = () => {
    const { id } = useParams(); // Obtener el ID de la URL
    
    useEffect(() => {
        if (id) {
            console.log('ID del pedido recibido:', id);
        }
    }, [id]);

    if (!id || isNaN(id)) {
        return <div>ID de pedido no válido</div>;
    }

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          <InvoicePDF idUsuario={parseInt(id)} />
        </PDFViewer>
      </div>
    );
  };
  
  export default App;