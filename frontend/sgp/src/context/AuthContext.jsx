import * as React from "react";

// Suposição da estrutura do seu contexto
const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null); // O estado agora guarda o objeto do usuário

  // Sua função de login agora define o objeto do usuário
  const login = (userData) => {
    // Aqui você faria a chamada à API e, no sucesso, faria:
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // O VALOR COMPARTILHADO:
  // - user: o objeto com os dados (ou null)
  // - auth: um booleano derivado da existência do usuário
  const value = { user, auth: !!user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// O hook que você já usa, agora ele pode retornar 'user' também
export function useAuth() {
  return React.useContext(AuthContext);
}
