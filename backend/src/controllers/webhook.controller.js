import { Webhook } from "svix";
import { User } from "../models/user.model.js";

export const clerkWebhook = async (req, res) => {
  // 1. Obtener el secreto de los Webhooks desde tu .env
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ Error: No se encontró CLERK_WEBHOOK_SECRET en el .env");
    return res.status(400).json({ message: "Falta el secreto del webhook" });
  }

  // 2. Obtener los headers de Svix para validar la seguridad
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ message: "Faltan headers de Svix" });
  }

  // 3. Obtener el body crudo (raw)
  const payload = req.body.toString();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // 4. Verificar que el mensaje realmente venga de Clerk
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Error verificando el webhook:", err.message);
    return res.status(400).json({ message: "Firma inválida" });
  }

  // 5. Manejar el evento "user.created"
  const eventType = evt.type;
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      const newUser = new User({
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "Usuario Nuevo",
        image: image_url,
      });

      await newUser.save();
      console.log(`✅ Usuario ${id} guardado con éxito en MongoDB`);
    } catch (dbError) {
      console.error("❌ Error guardando usuario en DB:", dbError.message);
    }
  }

  return res.status(200).json({ success: true });
};