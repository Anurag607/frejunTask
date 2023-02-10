import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "../styles/table.module.scss";

function createData(
  profilePic: string,
  user: string,
  email: number,
  age: number,
  gender: number
) {
  return { profilePic, user, email, age, gender };
}

export default function UsersTable({ data }: { data: any }) {
  const [users, setUsers] = React.useState<any>([]);

  const userPopulator = () => {
    let rows: any = [];
    data.forEach((el: any) => {
      rows.push(
        createData(
          el.image,
          `${el.firstName} ${el.lastName}`,
          el.email,
          el.age,
          el.gender
        )
      );
    });

    setUsers(rows);
  };

  React.useEffect(() => {
    userPopulator();
  }, [data]);

  return (
    <div className={styles.userList}>
      <TableContainer
        elevation={0}
        component={Paper}
        className={styles.tableHeadWrapper}
      >
        <Table aria-label="simple table" className={styles.tableHeadContainer}>
          <TableHead className={styles.tableHead}>
            <TableRow className={styles.tableRow}>
              <TableCell
                align="left"
                className={`${styles.tableCell} ${styles.userHeadCell}`}
              >
                User
              </TableCell>
              <TableCell
                align="left"
                className={`${styles.tableCell} ${styles.emailHeadCell}`}
              >
                email
              </TableCell>
              <TableCell
                align="left"
                className={`${styles.tableCell} ${styles.ageHeadCell}`}
              >
                age
              </TableCell>
              <TableCell
                align="left"
                className={`${styles.tableCell} ${styles.genderHeadCell}`}
              >
                gender
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer
        elevation={0}
        sx={{ maxWidth: 640, height: 300, overflowY: "scroll" }}
        component={Paper}
        className={styles.tableWrapper}
      >
        <Table
          sx={{ height: "max-content" }}
          aria-label="simple table"
          className={styles.tableContainer}
        >
          <TableBody className={styles.tableBody}>
            {users.map((row: any) => (
              <TableRow
                key={row.user}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                className={styles.tableRow}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className={`${styles.tableCell} ${styles.userCell}`}
                >
                  <img src={row.profilePic} />
                  <span> {row.user} </span>
                </TableCell>
                <TableCell
                  align="left"
                  className={`${styles.tableCell} ${styles.emailCell}`}
                  sx={{ width: 150, paddingRight: 0 }}
                >
                  <span>{row.email}</span>
                </TableCell>
                <TableCell
                  align="left"
                  className={`${styles.tableCell} ${styles.ageCell}`}
                >
                  <span>{row.age}</span>
                </TableCell>
                <TableCell
                  align="left"
                  className={`${styles.tableCell} ${styles.genderCell}`}
                >
                  <span>{row.gender}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
