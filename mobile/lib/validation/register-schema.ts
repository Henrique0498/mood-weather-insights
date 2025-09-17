import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  name: yup.string().required("Nome é obrigatório"),
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "As senhas devem corresponder")
    .required("Confirmação de senha é obrigatória"),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
