"use client"
import { useState } from "react"
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSales } from "@/context/sales-context"
import type { DateRange } from "react-day-picker"
import { format, isWithinInterval, parseISO } from "date-fns"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, Image } from "@react-pdf/renderer"

interface ExportReportProps {
  dateRange: DateRange | undefined
}

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #d10000',
    paddingBottom: 10,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  businessInfo: {
    textAlign: 'center',
    marginBottom: 5,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d10000',
    textAlign: 'center',
    marginBottom: 5,
  },
  businessAddress: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333333',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555555',
    borderLeft: '3px solid #d10000',
    paddingLeft: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeaderRow: {
    backgroundColor: '#d10000',
  },
  tableCol: {
    width: '20%',
    borderRightWidth: 1,
    borderRightColor: '#dddddd',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableCell: {
    fontSize: 9,
    color: '#333333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 9,
    textAlign: 'center',
    color: '#666666',
    borderTop: '1px solid #dddddd',
    paddingTop: 10,
  },
  summary: {
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    width: '50%',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555555',
  },
  summaryValue: {
    width: '50%',
    fontSize: 11,
    color: '#333333',
  },
  highlight: {
    color: '#d10000',
    fontWeight: 'bold',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 30,
    fontSize: 8,
    color: '#999999',
  },
});

// Componente para o relatório em PDF
const SalesReport = ({ orders, dateRange }: { orders: any[], dateRange: DateRange | undefined }) => {
  const totalValue = orders.reduce((total, order) => total + parseFloat(order.total.toString()), 0);
  const completedOrders = orders.filter(order => order.status === "Concluído").length;
  const pendingOrders = orders.filter(order => order.status === "Pendente").length;
  const canceledOrders = orders.filter(order => order.status === "Cancelado").length;

  const dateRangeText = dateRange?.from 
    ? dateRange.to && dateRange.from
      ? `${format(dateRange.from, 'dd/MM/yyyy')} até ${format(dateRange.to, 'dd/MM/yyyy')}`
      : dateRange.from ? `A partir de ${format(dateRange.from, 'dd/MM/yyyy')}` : 'Todo o período'
    : 'Todo o período';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            {/* Adicione um ícone de pizza como placeholder do logo */}
            <Text style={{ fontSize: 30, marginRight: 10 }}>🍕</Text>
            <View>
              <Text style={styles.businessName}>KANTINHO DELÍCIA</Text>
              <Text style={styles.businessAddress}>TERRA BRANCA, PRAIA - ILHA DE SANTIAGO - CABO VERDE</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.title}>Relatório de Vendas</Text>
        <Text style={styles.subtitle}>Período: {dateRangeText}</Text>
        
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de Pedidos:</Text>
            <Text style={styles.summaryValue}>{orders.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Valor Total:</Text>
            <Text style={[styles.summaryValue, styles.highlight]}>$ {totalValue.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pedidos Concluídos:</Text>
            <Text style={styles.summaryValue}>{completedOrders}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pedidos Pendentes:</Text>
            <Text style={styles.summaryValue}>{pendingOrders}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pedidos Cancelados:</Text>
            <Text style={styles.summaryValue}>{canceledOrders}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Detalhes dos Pedidos</Text>
        <View style={styles.table}>
          {/* Cabeçalho da tabela */}
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeaderCell}>ID</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeaderCell}>Data</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeaderCell}>Cliente</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeaderCell}>Total</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableHeaderCell}>Status</Text>
            </View>
          </View>

          {/* Linhas da tabela */}
          {orders.map((order) => (
            <View key={order.id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{order.id.substring(0, 8)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{order.date}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{order.customerName || "N/A"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>$ {parseFloat(order.total.toString()).toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{order.status}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Pizzaria Kantinho Delícia | Tel: (+238) 123 4567 | kantinhodelicia@email.com | Relatório gerado em {format(new Date(), 'dd/MM/yyyy HH:mm')}
        </Text>
        
        <Text style={styles.pageNumber}>Página 1</Text>
      </Page>
    </Document>
  );
};

export function ExportReport({ dateRange }: ExportReportProps) {
  const { orders } = useSales()
  const [isExporting, setIsExporting] = useState(false)

  const filteredOrders = dateRange?.from
    ? orders.filter((order) => {
        const orderDate = parseISO(order.date)
        if (!dateRange.from) return false // Verificação adicional para typecheck
        
        return dateRange.to
          ? isWithinInterval(orderDate, { start: dateRange.from, end: dateRange.to })
          : orderDate >= dateRange.from
      })
    : orders

  const exportToCSV = () => {
    setIsExporting(true)

    try {
      // Cabeçalho do CSV
      let csvContent = "ID,Data,Hora,Cliente,Telefone,Endereço,Método de Pagamento,Total,Status,Observações\n"

      // Dados dos pedidos
      filteredOrders.forEach((order) => {
        const row = [
          order.id,
          order.date,
          order.time,
          order.customerName || "N/A",
          order.customerPhone || "N/A",
          order.customerAddress || "N/A",
          order.paymentMethod,
          order.total,
          order.status,
          order.observations || "N/A",
        ]

        // Escapar campos com vírgulas
        const escapedRow = row.map((field) => {
          const fieldStr = String(field)
          return fieldStr.includes(",") ? `"${fieldStr}"` : fieldStr
        })

        csvContent += escapedRow.join(",") + "\n"
      })

      // Criar blob e link para download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      // Configurar e simular clique no link
      link.setAttribute("href", url)
      link.setAttribute("download", `relatorio-vendas-${format(new Date(), "yyyy-MM-dd")}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erro ao exportar relatório:", error)
      alert("Ocorreu um erro ao exportar o relatório.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-white mb-1">Exportar Relatório</h3>
      <div className="flex gap-2">
        <Button onClick={exportToCSV} disabled={isExporting} className="bg-green-600 hover:bg-green-700 text-white">
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 mr-2" />
          )}
          CSV
        </Button>
        
        <PDFDownloadLink 
          document={<SalesReport orders={filteredOrders} dateRange={dateRange} />} 
          fileName={`relatorio-vendas-${format(new Date(), "yyyy-MM-dd")}.pdf`}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 hover:bg-red-700 text-white h-10 px-4 py-2"
        >
          {({ loading }) => (
            <>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              PDF
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  )
}
