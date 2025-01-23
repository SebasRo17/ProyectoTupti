import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getDetallesPedido, getLastPedidoByUserId } from "../../Api/pedidoApi";
import { Page, Text, View, Document, PDFViewer, StyleSheet, Image } from "@react-pdf/renderer";

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

// Componente principal
const InvoicePDF = ({ idUsuario }) => {
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

    useEffect(() => {
        const fetchPedidoData = async () => {
            if (!idUsuario || isNaN(idUsuario)) {
                console.error('ID de usuario inválido:', idUsuario);
                return;
            }

            try {
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
                    invoiceNumber: `001-001-${ultimoPedido.IdPedido.toString().padStart(9, '0')}`,
                    date: new Date().toLocaleDateString()
                }));

            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        fetchPedidoData();
    }, [idUsuario]);

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
                    <Text style={styles.autLine}>RUC: 1714638598001</Text>
                    <Text style={styles.autLine}>FACTURA    N°: {invoiceData.invoiceNumber}</Text>
                    <Text style={styles.autLine}>NO. DE AUTORIZACION</Text>
                    <Text style={styles.autLine}>FECHA Y HORA DE AUTORIZACION</Text>
                    <Text style={styles.autLine}>AMBIENTE PRODUCCION</Text>
                    <Text style={styles.autLine}>EMISION NORMAL</Text>
                    <Text style={styles.autLine}>CLAVE DE ACCESO</Text>
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
            <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>SUBTOTAL</Text>
                <Text style={styles.colValueTotales}>{renderPrecio(invoiceData.totales.subtotal)}</Text>
            </View>
            <View style={styles.rowTotales}>
                <Text style={[styles.colLabelTotales, styles.descuentoLabel]}>DESCUENTO</Text>
                <Text style={styles.colValueTotales}>{renderPrecio(invoiceData.totales.descuentos)}</Text>
            </View>
            <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>IVA 15%</Text>
                <Text style={styles.colValueTotales}>{renderPrecio(invoiceData.totales.impuestos)}</Text>
            </View>
            <View style={styles.rowTotales}>
                <Text style={styles.colLabelTotales}>VALOR TOTAL</Text>
                <Text style={styles.colValueTotales}>{renderPrecio(invoiceData.totales.total)}</Text>
            </View>
          </View>
  
          {/* Footer */}
          <Text style={styles.footer}>Gracias por su compra</Text>
        </Page>
      </Document>
    );
  };
  

  
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