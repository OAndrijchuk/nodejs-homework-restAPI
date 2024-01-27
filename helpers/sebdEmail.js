import ElasticEmail from '@elasticemail/elasticemail-client';
import dotenv from "dotenv";

dotenv.config();
 
const sendEmail = ({ userEmail, title, bodyContent }) => {

const { ELASICEMAIL_API_KEY, ELASICEMAIL_FROM } = process.env;
const defaultClient = ElasticEmail.ApiClient.instance;
const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASICEMAIL_API_KEY
 
const api = new ElasticEmail.EmailsApi();    
const email = ElasticEmail.EmailMessageData.constructFromObject({
  Recipients: [
    new ElasticEmail.EmailRecipient(userEmail)
  ],
  Content: {
    Body: [
      ElasticEmail.BodyPart.constructFromObject({
        ContentType: "HTML",
        // Content: "<strong>My first test email</strong>"
        Content: bodyContent,
      })
    ],
    Subject: title,
    From: ELASICEMAIL_FROM
  }
});
 
const callback = function(error, data, response) {
  if (error) {
      // console.error(error);
      return error;
  } else {
      // console.log('API called successfully.');
      return {mes:'API called successfully.'}
  }
};

    api.emailsPost(email, callback);
};

export default sendEmail;