import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not defined. Mocking email to:', to);
        console.log('--- Mock Email ---');
        console.log('Subject:', subject);
        console.log('Content:', html);
        console.log('------------------');
        return { success: true, mocked: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'BabyVerse <notifications@ferbtnt.net>', // Requires domain verification on Resend
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Error sending email via Resend:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error sending email:', error);
        return { success: false, error };
    }
}
