import * as React from "react";
import {
  DataGrid,
  GridDeleteIcon,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  useGridApiContext,
  useGridSelector,
  gridPageCountSelector,
  GridPagination
  // useGridApiRef
} from "@mui/x-data-grid";
import { Box, Button, IconButton } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import PropTypes from "prop-types";

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

Pagination.propTypes = {
  className: PropTypes.string,
  /**
   * Callback fired when the page is changed.
   *
   * @param {React.MouseEvent<HTMLButtonElement> | null} event The event source of the callback.
   * @param {number} page The page selected.
   */
  onPageChange: PropTypes.func.isRequired,
  /**
   * The zero-based index of the current page.
   */
  page: PropTypes.number.isRequired
};

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

export default function DataTable(data) {
  // const apiRef = useGridApiRef();
  const users = data.data;

  const columns = [
    {
      field: "name",
      headerClassName: "tableHeader",
      headerName: "Name",
      flex: 2,
      editable: true
    },
    {
      field: "email",
      headerClassName: "tableHeader",
      headerName: "Email",
      flex: 3,
      editable: true
    },
    {
      field: "role",
      headerClassName: "tableHeader",
      headerName: "Role",
      flex: 1,
      editable: true
    },
    {
      field: "delete",
      headerClassName: "tableHeader",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          aria-label="delete"
          onClick={() => handleRowDelete(params.row.id)}
        >
          <GridDeleteIcon />
        </IconButton>
      )
    }
  ];

  const [rows, setRows] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);

  React.useEffect(() => {
    setRows(users);
  }, [users]);

  // React.useEffect(() => {
  //   const handleheaderSelectionCheckboxChange = (params, event) => {
  //     console.log("params:", params);
  //     console.log("event:", event);
  //   };

  //   // The `subscribeEvent` method will automatically unsubscribe in the cleanup function of the `useEffect`.
  //   return apiRef.current.subscribeEvent(
  //     "headerSelectionCheckboxChange",
  //     handleheaderSelectionCheckboxChange
  //   );
  // }, [apiRef]);

  const handleRowDelete = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const handleRowSelection = (newRowSelectionModel) => {
    setSelectedRows(newRowSelectionModel);
  };

  function CustomToolbar() {
    const handleDeleteClick = () => {
      const updatedRows = rows.filter((row) => !selectedRows.includes(row.id));
      setRows(updatedRows);
    };

    return (
      <GridToolbarContainer
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px"
        }}
      >
        <GridToolbarQuickFilter debounceMs={500} />
        <Button variant="contained" color="error" onClick={handleDeleteClick}>
          Delete Selected Rows
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <Box
      sx={{
        height: "97vh",
        width: "100%",
        "& .tableHeader": {
          backgroundColor: "black",
          color: "white"
        }
      }}
    >
      <DataGrid
        // apiRef={apiRef}
        editMode="row"
        rows={rows}
        columns={columns}
        getRowHeight={() => "auto"}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } }
        }}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRows}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        pagination
        slots={{ toolbar: CustomToolbar, pagination: CustomPagination }}
      />
    </Box>
  );
}
