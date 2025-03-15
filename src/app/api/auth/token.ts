import { getAccessToken } from "@auth0/nextjs-auth0";

export default async function handler(req: any, res: any) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error obteniendo el token:", error);
    res.status(500).json({ error: "No se pudo obtener el token" });
  }
}
