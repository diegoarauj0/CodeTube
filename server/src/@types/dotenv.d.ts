declare namespace NodeJS {
  interface ProcessEnv {
    Port_Express?: string;
    URL_MongoDB?: string;
    Salt_Bcrypt?: string;
    Secret_JWT?: string;
    ExpiresIn_JWT?: string;
  }
}