import { QuoteInput } from 'src/resolvers/QuoteResolver';
import { MailOptionsLessFromTo } from './sendEmail';

export const createEmailData = ({
    name,
    email,
    phoneNumber,
    description,
}: QuoteInput): MailOptionsLessFromTo => {
    const subject = 'QUOTE REQUEST FROM WEBSITE';
    const text = `
New Quote Request From ${name}

Email: ${email}
Phone Number: ${phoneNumber}
Description: ${description}

Thanks and all the best,
Your favourite nephew Tim
`;

    const html = `
<h1>New Quote Request From ${name}</h1>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone Number:</strong> ${phoneNumber}</p>
<p><strong>Description:</strong> ${description}</p>
<br/>
<p>Thanks and all the best,</p> 
<p>Your favourite nephew Tim</p>

`;
    return {
        text,
        html,
        subject,
    };
};
