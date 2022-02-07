import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";

export default function DataTable() {
  let [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [selectionModel, setSelectionModel] = React.useState(() =>
    rows.map((r) => r.id)
  );
  const [isSelected, setIsSelected] = React.useState(true);
  const [searchedRows, setSearchedRows] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [form, setForm] = React.useState({});

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSubmit = (event) => {
    console.log(event);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  React.useEffect(() => {
    axios
      .get(
        `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
      )
      .then((response) => {
        setRows(response.data);
      });
  }, []);

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const deleteSelected = (selectedRows) => {
    // selectedRows = selectedRows.filter(id => id > page && id < page + 10);
    console.log("before slice", selectedRows);
    selectedRows = selectedRows.slice(page * 10, page * 10 + 10);
    console.log("after slice", selectedRows);
    setRows(rows.filter((row) => selectedRows.includes(row.id) === false));
    setSelectionModel([]);
  };

  const editRow = (row, event) => {
    handleClick(event);
  };

  const renderDetailsButton = (params) => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={() => {
            deleteRow(params.row.id);
          }}
        >
          <DeleteOutlineIcon />
        </IconButton>
        <div>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(event) => {
              params.api.state.selection = [];
              editRow(params.row, event);
              setForm({
                ...form,
                name: params.row.name,
                email: params.row.email,
                role: params.row.role,
                id: params.row.id,
              });
            }}
          >
            <EditIcon />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "25ch" },
                display: "flex",
                justifyContent: "space-between",
              }}
              noValidate
              autoComplete="off"
              onSubmit={(event) => {
                params.api.state.selection = [];
                event.preventDefault();
                handleClose();
                let index = rows.findIndex((row) => row.id === form.id);
                rows[index].name = event.target[0].value;
                rows[index].email = event.target[2].value;
                rows[index].role = event.target[4].value;
                setRows(rows);
              }}
            >
              <TextField
                required
                id="outlined-required"
                label="Name"
                defaultValue={form.name}
              />
              <TextField
                required
                id="outlined-required"
                label="Email"
                defaultValue={form.email}
              />
              <TextField
                required
                id="outlined-required"
                label="Role"
                defaultValue={form.role}
              />
              <Button type="submit" variant="outlined">
                Submit
              </Button>
            </Box>
          </Popover>
        </div>
      </div>
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 160, editable: true },
    { field: "email", headerName: "Email", width: 200, editable: true },
    { field: "role", headerName: "Role", width: 130, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 190,
      renderCell: renderDetailsButton,
    },
  ];
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "52ch",
        "&:focus": {
          width: "52ch",
        },
      },
    },
  }));

  React.useEffect(() => {
    setSearchedRows(
      rows.filter(
        (row) =>
          row.name.toLocaleLowerCase().includes(query) ||
          row.email.toLocaleLowerCase().includes(query) ||
          row.role.toLocaleLowerCase().includes(query) ||
          row.id.toLocaleLowerCase().includes(query)
      )
    );
  }, [query]);

  return (
    <div
      style={{
        height: 530,
        width: "65%",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Admin Dashboard
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={query}
                onChange={(e) => {
                  setQuery(e.currentTarget.value.toLocaleLowerCase());
                }}
                autoFocus={true}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
      <DataGrid
        rows={query.length === 0 ? rows : searchedRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={isSelected}
        hideFooter={true}
        page={page}
        selectionModel={selectionModel}
        onSelectionModelChange={setSelectionModel}
      />

      <div
        style={{
          margin: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Chip
          label="Delete Selected"
          color="error"
          variant="outlined"
          disabled={selectionModel.length === 0}
          onClick={() => {
            deleteSelected(selectionModel);
          }}
        />
        <Stack spacing={2}>
          <Pagination
            onChange={(params) => {
              setPage(parseInt(params.currentTarget.innerText) - 1);
            }}
            count={Math.ceil(rows.length / 10)}
            color="primary"
            variant="outlined"
            showFirstButton
            showLastButton
          />
        </Stack>
      </div>
    </div>
  );
}
