"use client";
import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { formatDate, formatDateWithTime } from "@/_utils/helper";
import { IItems } from "@/_interface/interface";
// Create styles
const styles = StyleSheet.create({
  flex: {
    display: "flex",
  },
  page: {
    fontSize: 12,
    padding: 20,
    lineHeight: 1.5,
    flexDirection: "column",
    backgroundColor: "#FFF",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  invoiceTitle: {
    fontSize: 20,
    padding: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: {
    whiteSpace: "nowrap",
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: "center",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 10,
  },
  image: {
    width: 30,
    height: 30,
    objectFit: "contain",
    margin: "0 auto",
  },
});

const date = new Date();

export const SalesDocument = ({ order, start_date, end_date }: { order: any; start_date: string; end_date: string }) => {
  // Calculate total amount
  const total = order.reduce(
    (total: number, item: any) =>
      total +
      item.tbl_items.reduce((itemTotal: number, item: IItems) => itemTotal + item.item_product_price_at_time_purchase * item.item_quantity, 0),
    0
  );
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Text style={styles.invoiceTitle}>Seoul Mart Korean Store</Text>
          </View>
          <Text>Soldiers Hills Phase IV Almond Drive, Molino VI, Bacoor</Text>
          <Text>seoulmart@gmail.com</Text>
          <Text>{formatDate(date.toString())}</Text>
        </View>

        <View style={styles.section}>
          <View>
            <Text style={styles.bold}>
              Sales from {formatDate(start_date)} to {formatDate(end_date)}
            </Text>
          </View>
        </View>

        {/* Invoice Items */}
        <View style={styles.section}>
          <Text style={styles.bold}>Sales Report Details:</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Order #</Text>
              <Text style={styles.tableColHeader}>Customer Name</Text>
              <Text style={styles.tableColHeader}>Products</Text>
              <Text style={styles.tableColHeader}>Total</Text>
              <Text style={styles.tableColHeader}>Date Ordered</Text>
            </View>
            {/* Table Rows */}
            {order.map((item: any, index: number) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{item.order_number}</Text>
                <Text style={styles.tableCol}>{item.tbl_users.user_email}</Text>
                <Text style={styles.tableCol}>{item.tbl_items.map((item: IItems) => item.item_product_name).join(", ")}</Text>
                <Text style={styles.tableCol}>
                  PHP{" "}
                  {item.tbl_items.reduce((total: number, item: IItems) => total + item.item_product_price_at_time_purchase * item.item_quantity, 0)}
                </Text>
                <Text style={styles.tableCol}>{formatDateWithTime(item.order_date_created)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCol,
                {
                  width: "80%",
                  textAlign: "right",
                  fontWeight: "bold",
                  paddingRight: 10,
                },
              ]}
            >
              Total Revenue:
            </Text>
            <Text style={[styles.tableCol, { width: "20%", fontWeight: "bold" }]}>PHP {total}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SalesDocument;
