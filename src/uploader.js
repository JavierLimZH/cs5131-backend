import axios from "axios";

function fileToBase64(files) {
    return new Promise((res, rej)=>{
        let reader = new  FileReader();
        reader.onload = (e) => {
            res(e);
        }
        reader.onerror = (e) => {
            rej(e);
        }
        reader.readAsDataURL(files)
    })
}

function fileToAPI(url, files, params) {
    return filesToAPI(url, {file: files}, params);
}

function filesToAPI(url, files, params) {
    let formData = new FormData();
    for (const [key, value] of Object.entries(files)) {
        formData.append(key, value);
    }

    return axios.post(
        url,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: params
        }
    )
}

export {fileToBase64, fileToAPI, filesToAPI}