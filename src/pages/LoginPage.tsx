import AuthRedirect from "../components/auth/AuthRedirect";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <AuthRedirect>
      <LoginForm />
    </AuthRedirect>
  );
};

export default LoginPage;
