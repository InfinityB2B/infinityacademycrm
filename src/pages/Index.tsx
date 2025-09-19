import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const Index = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard")
      } else {
        navigate("/login")
      }
    }
  }, [navigate, user, loading])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
        <p className="text-xl text-muted-foreground">Redirecionando para o dashboard</p>
      </div>
    </div>
  );
};

export default Index;
