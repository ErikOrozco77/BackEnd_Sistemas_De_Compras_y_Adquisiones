import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "orozcoalcarazerik@gmail.com",
        pass: "hjlg cnuv xjtl csrk",
    }
});



export async function sendConfirmationEmail(
    names: string,
    to: string,
    token: string
) {
    try {
        const mailOptions = {
            from: "desarrollo_tecnologico@stjcolima.gob.mx",
            to: to,
            subject: "Confirmación de registro como proveedor",
            text:
            `Estimado/a ${names},\n\n` +
            "Le saludamos cordialmente desde el Comité de Adquisiciones, Arrendamientos y Servicios del Poder Judicial del Estado de Colima. Nos complace informarle que su registro como proveedor ha sido exitoso.\n" +
            "Para completar su registro y continuar con el proceso, por favor siga estos pasos:\n" +
            `1. Registre la contraseña de su cuenta ingresando a: http://localhost:4200/confirmacion/${token}\n2. Inicie sesión una vez registrada su contraseña.\n`+
            "3.-Complete todos los campos requeridos para registrar sus datos personales y de la empresa.\n" +
            "4.-Suba una copia escaneada en formado PDF de su INE (Instituto Nacional Electoral) y su constancia de situación fiscal vigente.\n\n" +
            "Es importante que proporcione toda la información solicitada de manera completa y precisa para que podamos procesar su registro de manera eficiente.\n" +
            "Si tiene alguna pregunta o necesita asistencia adicional, no dude en ponerse en contacto con nuestro equipo a través de control_patrimonial@stjcolima.gob.mx o llamando al 3123131301.\n" +
            "Gracias por su interés en convertirse en proveedor del Poder Judicial de Colima. Esperamos colaborar juntos en futuros proyectos.\n" +
            "Saludos cordiales,\n\n" +
            "Roberto Marquez Barreto\n" +
            "Presidente del Comité de Adquisiciones, Arrendamientos y Servicios\n" +
            "Poder Judicial del Estado de Colima"
            

        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo electrónico enviado:", info.messageId);
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
    }
}

