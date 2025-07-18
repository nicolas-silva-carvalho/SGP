import { api, requestConfig } from "../utils/config";

const register = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

function logout() {
  localStorage.removeItem("user");
}

async function login(data) {
  const config = requestConfig("POST", data);

  try {
    const response = await fetch(`${api}/users/login`, config);
    const res = await response.json();

    if (!response.ok) {
      // Exibe erro detalhado
      console.error("Erro no login:", res);
      return res;
    }

    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.error("Erro na requisição login:", error);
    return { errors: ["Erro de rede ou servidor fora do ar."] };
  }
}

async function getAllUsers() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const config = requestConfig("GET", null, token);

  try {
    const response = await fetch(`${api}/users/`, config);
    const res = await response.json();

    if (!response.ok) {
      console.error("Erro ao buscar usuários:", res);
      return res;
    }

    return res;
  } catch (error) {
    console.error("Erro na requisição:", error);
    return { errors: ["Erro de rede ou servidor fora do ar."] };
  }
}

export const authService = {
  register,
  logout,
  login,
  getAllUsers,
};

export default authService;
