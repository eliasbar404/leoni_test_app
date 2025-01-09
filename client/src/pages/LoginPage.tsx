import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { WavyBackground } from '../components/WavyBackground';
import { LoginForm } from '../components/LoginForm';
import Swal from 'sweetalert2';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (cin: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        cin,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);

      // alert(`Welcome back, ${user.lastName} ${user.firstName}!`);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Welcome back, ${user.lastName} ${user.firstName}!`,
        showConfirmButton: false,
        timer: 1500
      });

      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "FORMATEUR":
          navigate("/formateur/dashboard");
          break;
        case "OPERATEUR":
          navigate("/operateur/dashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-100">
      <WavyBackground />
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
          {/* Left Panel */}
          <div className="hidden md:flex flex-col items-center justify-center p-12 bg-[#070a94] bg-opacity-90">
            <h1 className="text-white text-9xl font-extrabold mb-6">LEONI</h1>
            <p className="text-blue-100 text-center text-2xl font-black">
              {/* Bienvenue sur votre portail de formation */}
              SITE AGADIR
            </p>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Se Connecter</h2>
                <p className="text-gray-600">Entrez vos identifiants pour accéder à votre compte</p>
              </div>
              
              <LoginForm onSubmit={handleLogin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;



