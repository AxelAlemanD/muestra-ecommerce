/* eslint-disable id-blacklist */
// To display the name of the control in the error message,
// add INPUT_NAME at the position where you want to display it.

export const errorMessages = {
    text: {
      required: 'El campo INPUT_NAME es requerido',
      pattern: 'Ingresa un INPUT_NAME valido',
      minlength: 'El campo INPUT_NAME debe contener al menos 8 caracteres',
      mismatch: 'Asegúrese de que la contraseña sea la misma'
    },
    number: {
      required: 'El campo INPUT_NAME es requerido',
      max: 'Por favor ingresa una cantidad valida',
      min: 'El valor ingresado es menor al permitido',
    },
    date: {
      required: 'El campo INPUT_NAME es requerido',
    },
    time: {
      required: 'El campo INPUT_NAME es requerido',
    },
    email: {
      email: 'Por favor, introduce un email valido',
      required: 'El campo INPUT_NAME es requerido',
    },
    password: {
      minlength: 'El campo INPUT_NAME debe contener al menos 8 caracteres',
      required: 'El campo INPUT_NAME es requerido',
      pattern: 'Ingresa una INPUT_NAME valida',
      mismatch: 'Asegúrese de que la contraseña sea la misma'
    },
    tel: {
      required: 'El campo INPUT_NAME es requerido',
      invalidPhone: 'El INPUT_NAME debe contener exactamente 10 dígitos numéricos',
      invalidPrefix: 'El INPUT_NAME debe comenzar con una lada de Nuevo León'
    },
};
