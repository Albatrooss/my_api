import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import Mail from 'nodemailer/lib/mailer';

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN,
    FROM_EMAIL,
    TO_EMAIL,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
);

oAuth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
});

export interface MailOptionsLessFromTo {
    subject: string;
    text: string;
    html: string;
}

export const sendEmail = async (mailData: MailOptionsLessFromTo) => {
    // return true;
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oAuth2',
                user: FROM_EMAIL,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken,
            },
        } as any);

        const mailOptions: Mail.Options = {
            from: FROM_EMAIL,
            to: TO_EMAIL,
            ...mailData,
        };

        await transport.sendMail(mailOptions);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};
