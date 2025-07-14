import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../slices/authSlice";

import Layout from "../../components/Layout";

import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Box from "@mui/material/Box";

import { ptBR } from "@mui/x-data-grid/locales";

export default function Users(props) {
  const dispatch = useDispatch();
  const { users, usersLoading, usersError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Handlers dos botões (você deve implementar as funções reais)
  const handleView = (id) => {
    alert(`Visualizar usuário ${id}`);
    // Por exemplo: navigate(`/users/${id}`);
  };

  const handleEdit = (id) => {
    alert(`Editar usuário ${id}`);
    // Por exemplo: navigate(`/users/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      alert(`Excluir usuário ${id}`);
      // Aqui você chama sua action de exclusão
    }
  };

  const columns = [
    { field: "name", headerName: "Nome", flex: 1, minWidth: 150 },
    { field: "email", headerName: "E-mail", flex: 1, minWidth: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon color="primary" />}
          label="Visualizar"
          onClick={() => handleView(params.id)}
        />,
        <GridActionsCellItem
          icon={<EditIcon color="warning" />}
          label="Editar"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Excluir"
          onClick={() => handleDelete(params.id)}
          showInMenu // aparece no menu (opcional)
        />,
      ],
    },
  ];

  return (
    <Layout {...props} title="Controle de usuários">
      {usersError && (
        <Typography color="error" sx={{ mb: 2 }}>
          Erro ao carregar usuários: {usersError}
        </Typography>
      )}

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={users}
          columns={columns}
          loading={usersLoading}
          getRowId={(row) => row.id} // garante o id correto da linha
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
          autoHeight={false}
        />
      </Box>
    </Layout>
  );
}
