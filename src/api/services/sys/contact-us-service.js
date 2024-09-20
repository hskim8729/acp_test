import { axiosApiDEV } from "@/api";

export default {
    // == contact us ==
    sendContactUsMail(params) {
        const formData = new FormData();
        formData.append("title", params.title);
        formData.append("content", params.content);
        formData.append("email", params.email);
        formData.append("phone", params.phone);

        if (params.files) {
            for (let i = 0; i < params.files.length; i++) {
                formData.append("files", params.files[i]);
            }
        }

        return new Promise((resolve, reject) => {
            axiosApiDEV
            .post('/v1/contactUs/sendContactUsMail', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            })
        });
    }
}