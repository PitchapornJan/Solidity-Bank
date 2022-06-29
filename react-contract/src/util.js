//ดักจับ error
const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            try{
                const web3 = new Web3("http://127.0.0.1:7545");
                resolve(web3);
            }catch (error){
                reject(error);
            }
        })
    });
}