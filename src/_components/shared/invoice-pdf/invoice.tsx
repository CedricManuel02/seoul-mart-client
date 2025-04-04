"use client";
import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { calculateProductTotal, formatDate } from "@/_utils/helper";

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

export const MyDocument = ({ order }: { order: any }) => {
  // Calculate the order total once
  const { total } = calculateProductTotal(order);
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

        {/* Billing Info */}
        <View style={styles.section}>
          <View>
            <Text style={styles.bold}>Ship To:</Text>
            <Text>Order # {order.order_number}</Text>
            <Text>
              {order.tbl_order_information[0].order_information_first_name} {order.tbl_order_information[0].order_information_last_name}
            </Text>
            <Text>{order.tbl_order_information[0].order_address_complete}</Text>
            <Text>
              {order.tbl_order_information[0].order_address_cities} {order.tbl_order_information[0].order_address_province}
            </Text>
          </View>
        </View>

        {/* Invoice Items */}
        <View style={styles.section}>
          <Text style={styles.bold}>Invoice Details:</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Barcode</Text>
              <Text style={styles.tableColHeader}>Image</Text>
              <Text style={styles.tableColHeader}>Product</Text>
              <Text style={styles.tableColHeader}>Variant</Text>
              <Text style={styles.tableColHeader}>Quantity</Text>
              <Text style={styles.tableColHeader}>Price</Text>
            </View>
            {/* Table Rows */}
            {order.tbl_items.map((item: any, index: number) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{item.tbl_variant.tbl_products.product_upc_number}</Text>
                <Text style={styles.tableCol}>
                  <Image src={item.item_product_image} style={styles.image} />
                </Text>
                <Text style={styles.tableCol}>{item.item_product_name}</Text>
                <Text style={styles.tableCol}>{item.item_variant_name}</Text>
                <Text style={styles.tableCol}>x{item.item_quantity}</Text>
                <Text style={styles.tableCol}>PHP {item.item_product_price_at_time_purchase}</Text>
              </View>
            ))}
            {/* Total Row */}
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
                Shipping Fee:
              </Text>
              <Text style={[styles.tableCol, { width: "20%", fontWeight: "bold" }]}>PHP {order.order_shipping_fee}</Text>
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
                Total:
              </Text>
              <Text style={[styles.tableCol, { width: "20%", fontWeight: "bold" }]}>PHP {total}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
