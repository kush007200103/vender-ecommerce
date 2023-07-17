
/* The readAsDataURL method of the FileReader object is called with the file parameter.
         This method reads the contents of the specified file and converts it to a data URL.*/
         async function ImagetoBase64(file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
          
            const data = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = (err) => reject(err);
            });
          
            return data;
          }
          
          export { ImagetoBase64 };