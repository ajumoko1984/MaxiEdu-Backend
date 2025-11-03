import JWT from "jsonwebtoken";

export const generateJwtToken = ({
  data = {},
  timeToLive = `${process.env.TOKEN_EXPIRE_TIME}` || "1h",
  secret = `${process.env.SERVER_TOKEN_SECRET}` || "secret",
}: {
  data: any;
  timeToLive?: string;
  secret?: string;
}) => {
  return new Promise((resolve, _reject) => {
    const signOptions: any = {
      issuer: "HMOSystems",
      subject: "Role Based Access Control",
      algorithm: "HS256",
      audience: ["The Staff", "The Admin", "The Super Admin"],
    };
    signOptions.expiresIn = timeToLive;

    JWT.sign(data, secret, signOptions, (err: any, token: any) => {
      if (err) {
        console.error(err.message);
      }

      resolve(token);
    });
  });
};
export const clearJwtToken = ({
  data = {},
  timeToLive = "2s",
  secret = "secret",
}: {
  data: any;
  timeToLive?: string;
  secret?: string;
}) => {
  return new Promise((resolve, _reject) => {
    const signOptions: any = {
      issuer: "HMOSystems",
      subject: "Role Based Access Control",
      algorithm: "HS256",
      audience: ["The Staff", "The Admin", "The Super Admin"],
    };
    signOptions.expiresIn = timeToLive;

    JWT.sign(data, secret, signOptions, (err: any, token: any) => {
      if (err) {
        console.error(err.message);
      }

      resolve(token);
    });
  });
};
