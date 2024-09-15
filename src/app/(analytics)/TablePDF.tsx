// import React from "react";
// import { Document, Page, View, StyleSheet, Text } from "@react-pdf/renderer";

// interface TableData {
//   column1: string;
//   column2: string;
//   column3: string;
//   column4: string;
// }

// interface TablePDFProps {
//   data: TableData[];
// }

// const styles = StyleSheet.create({
//   tableContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginVertical: 10,
//   },
//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#000",
//     alignItems: "center",
//     height: 24,
//     fontStyle: "bold",
//   },
//   cell: {
//     width: "25%",
//     paddingHorizontal: 5,
//   },
// });

// const TablePDF: React.FC<TablePDFProps> = ({ data }) => (
//   <Document>
//     <Page size="A4" style={styles.row}>
//       <View style={styles.tableContainer}>
//         {/* Render the table header */}
//         <View style={styles.row}>
//           <Text style={[styles.cell, { fontWeight: "bold" }]}>Column 1</Text>
//           <Text style={[styles.cell, { fontWeight: "bold" }]}>Column 2</Text>
//           <Text style={[styles.cell, { fontWeight: "bold" }]}>Column 3</Text>
//           <Text style={[styles.cell, { fontWeight: "bold" }]}>Column 4</Text>
//         </View>

//         {/* Render the table rows */}
//         {data.map((row, index) => (
//           <View style={styles.row} key={index}>
//             <Text style={styles.cell}>{row.column1}</Text>
//             <Text style={styles.cell}>{row.column2}</Text>
//             <Text style={styles.cell}>{row.column3}</Text>
//             <Text style={styles.cell}>{row.column4}</Text>
//           </View>
//         ))}
//       </View>
//     </Page>
//   </Document>
// );

// export default TablePDF;

export default function TablePDF() {
  return <div>TablePDF</div>;
}
