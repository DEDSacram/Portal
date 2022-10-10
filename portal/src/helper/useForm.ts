import { createStore } from "solid-js/store";

type FormFields = {
  username?: string;
  password?: string;
};

const submit = (form: FormFields) => {
  const dataToSubmit = {
    username: form.username,
    password: form.password,
  };
  return dataToSubmit
};
const useForm = () => {
  const [form, setForm] = createStore<FormFields>({
    username: "",
    password: ""
  });

  const clearField = (fieldusername: string) => {
    setForm({
      [fieldusername]: ""
    });
  };

  const updateFormField = (fieldusername: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    if (inputElement.type === "checkbox") {
      setForm({
        [fieldusername]: !!inputElement.checked
      });
    } else {
      setForm({
        [fieldusername]: inputElement.value
      });
    }
  };

  return { form, submit, updateFormField, clearField };
};

export { useForm };
