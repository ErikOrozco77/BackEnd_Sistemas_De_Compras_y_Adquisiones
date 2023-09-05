import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "servidor5034.sv.controladordns.com",
    port: 26,
    secure: false,
    auth: {
        user: "desarrollo_tecnologico@stjcolima.gob.mx",
        pass: "STJcol_D3S4RR0LL02023",
    },
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
            subject: "Ha sido registrado como proveedor",
            text:
                names +
                " usted ha sido registrado en nuestro sistema como provedor, para confirmar su cuenta y continuar con el registro, favor de ingresar a: http://localhost:4200/confirmar/" +
                token,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Correo electrónico enviado:", info.messageId);
    } catch (error) {
        console.error("Error al enviar el correo electrónico:", error);
    }
}
