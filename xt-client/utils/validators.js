export class Validators {
  static email = (value) => {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return value && regex.test(value);
  }

  static password = (value) => {
    return value && value.length >= 4;
  }

  static name = (value) => {
    const regex = /^[a-zA-Z\- ]{2,30}$/;
    return value && regex.test(value);
  }

  static title = (value) => {
    const regex = /^[a-zA-Z0-9 ]*$/;
    return value && regex.test(value);
  }

  static price = (value) => {
    const regex = /^\d{0,8}(\.\d{1,2})?$/;
    return value && regex.test(value);
  }

}

export default Validators;