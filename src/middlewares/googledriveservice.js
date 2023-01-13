const fs = require('fs');
const { google, } = require('googleapis')

const authenticateGoogle = () => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            "type": "service_account",
            "project_id": process.env.CLOUD_SERVICE_ACCOUNT_PROJECT_ID,
            "private_key_id": process.env.CLOUD_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
            "private_key": `${process.env.CLOUD_SERVICE_ACCOUNT_PRIVATE_KEY_FULL}`,
            "client_email": process.env.CLOUD_SERVICE_ACCOUNT_CLIENT_EMAIL,
            "client_id": process.env.CLOUD_SERVICE_ACCOUNT_CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": process.env.CLOUD_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL

        },
        scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
};

const uploadToGoogleDrive = async (file, auth) => {
    const fileMetadata = {
        // name: file.originalname,
        name: new Date().getTime() + '-' + (file.originalname.replace(/ /g, '-')),
        parents: ["1Xu9L0LGZnExMC2pRx3_PAoaVjFnAmVMm"], // Change it according to your desired parent folder id
    };

    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
    };

    const driveService = google.drive({ version: "v3", auth });

    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
    return response;
};

// const deleteFile = (filePath) => {
//     fs.unlink(filePath, () => {
//         console.log("file deleted");
//     });
// };

module.exports = {
    authenticateGoogle,
    uploadToGoogleDrive,
}